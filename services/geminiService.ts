
import { GoogleGenAI, Type } from "@google/genai";
import { Scores, FeedbackData, InterviewDetails } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        interviewDetails: {
             type: Type.OBJECT,
             properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                course: { type: Type.STRING },
                date: { type: Type.STRING },
                decision: { type: Type.STRING },
             }
        },
        overallSummary: {
            type: Type.STRING,
            description: "A brief, encouraging paragraph summarizing the candidate's overall performance based on the provided scores and visa decision. Frame this from the perspective of a consular officer."
        },
        detailedFeedback: {
            type: Type.ARRAY,
            description: "An array of detailed feedback for each question based on the scores.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The original interview question." },
                    scores: {
                        type: Type.OBJECT,
                        properties: {
                            fluency: { type: Type.NUMBER },
                            facialExpressions: { type: Type.NUMBER },
                            bodyLanguage: { type: Type.NUMBER },
                            context: { type: Type.NUMBER }
                        }
                    },
                    strengths: { type: Type.STRING, description: "What the applicant did well, inferred from high scores (e.g., clearly stated purpose, strong ties)." },
                    areasForImprovement: { type: Type.STRING, description: "Specific, actionable suggestions for improvement based on low scores (e.g., weak ties, unclear intentions)." },
                    suggestions: { type: Type.STRING, description: "General tips for a visa interview related to the question and scores." }
                },
                required: ["question", "scores", "strengths", "areasForImprovement", "suggestions"]
            }
        },
        conclusion: {
            type: Type.STRING,
            description: "A concluding statement, tailored to the visa decision. If approved, it should be a brief confirmation. If refused, it should be a polite, standard closing that encourages them to address the identified issues before reapplying."
        }
    },
    required: ["interviewDetails", "overallSummary", "detailedFeedback", "conclusion"]
};

const createPrompt = (scores: Scores[], details: InterviewDetails): string => {
  const scoresText = scores
    .map((s, index) => `Question ${index + 1}: ${s.question}
Scores:
- Fluency & Confidence: ${s.fluency}/10
- Facial Expressions & Eye Contact: ${s.facialExpressions}/10
- Body Language & Poise: ${s.bodyLanguage}/10
- Context & Credibility: ${s.context}/10`
    )
    .join('\n\n---\n\n');
  
  const decisionText = details.decision === 'Approved' 
    ? "The final decision is APPROVED. The feedback should be concise and confirm the positive aspects that led to this decision."
    : "The final decision is REFUSED. The feedback must be constructive, polite, and professional. It should clearly explain the likely reasons for refusal based on the scores (e.g., failure to prove non-immigrant intent, inconsistent answers) and suggest what the applicant needs to work on, without giving false hope.";

  return `
    You are an experienced U.S. Consular Officer conducting a mock visa interview. Your task is to provide official, constructive feedback based on scores given to a visa applicant. The primary goal of a visa interview is for the applicant to prove strong ties to their home country and demonstrate clear non-immigrant intent.

    Applicant Details:
    - Applicant Name: ${details.name}
    - Visa Type Applied For: ${details.course} (e.g., F-1 Student, B-2 Visitor)
    - Interview Date: ${details.date}
    - Assessment ID: ${details.id}
    - Final Decision: ${details.decision}

    ${decisionText}

    The scores are on a scale of 1 to 10 for four parameters crucial for a visa interview:
    - Fluency & Confidence: Clarity of speech, confidence, and straightforwardness. (1=Hesitant/Nervous, 10=Clear/Confident)
    - Facial Expressions & Eye Contact: Appears trustworthy and engaging. (1=Avoidant/Anxious, 10=Trustworthy/Engaging)
    - Body Language & Poise: Posture and gestures indicating calmness and honesty. (1=Fidgety/Closed-off, 10=Composed/Confident)
    - Context & Credibility: Answer is directly relevant, credible, and demonstrates non-immigrant intent. (1=Irrelevant/Inconsistent, 10=Credible/Well-structured)

    Here are the questions asked and the scores the applicant received:

    ${scoresText}

    Please provide a detailed analysis from the perspective of a consular officer. Address the feedback to the applicant, ${details.name}. 
    1.  Start with an overall summary of their performance.
    2.  For each question, analyze the scores. Highlight strengths (for high scores on credibility, ties, etc.) and identify specific areas for improvement (for low scores on context, confidence, etc.).
    3.  Provide a concluding statement that aligns with the final visa decision.
    
    The tone of the entire response must be professional, direct, and appropriate for an official embassy communication.

    Return the feedback in the specified JSON format.
  `;
};

export const generateFeedback = async (scores: Scores[], details: InterviewDetails): Promise<FeedbackData> => {
  const prompt = createPrompt(scores, details);

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", 
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: feedbackSchema,
      temperature: 0.5,
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("Received an empty response from the AI.");
  }
  
  try {
    const feedbackData: FeedbackData = JSON.parse(responseText);
    return feedbackData;
  } catch (error) {
    console.error("Failed to parse JSON response:", responseText);
    throw new Error("The AI returned an invalid response format.");
  }
};