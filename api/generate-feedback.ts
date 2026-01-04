
import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from './_lib/supabaseClient.js';

// Types copied from the main app to make the function self-contained
enum HiringDecision {
    Approved = 'Approved',
    Refused = 'Refused',
    Pending = 'Pending',
}

interface InterviewDetails {
    id: string;
    name: string;
    course: string;
    date: string;
    referenceNumber?: string;
    sessionNumber?: number;
    time?: string;
    decision?: HiringDecision;
}

interface Scores {
  question: string;
  fluency: number;
  facialExpressions: number;
  bodyLanguage: number;
  context: number;
}

// --- Environment Variable Check ---
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set in Vercel.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Gemini API Configuration ---
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
                referenceNumber: { type: Type.STRING },
                sessionNumber: { type: Type.NUMBER },
                time: { type: Type.STRING },
                decision: { type: Type.STRING },
             }
        },
        overallSummary: {
            type: Type.STRING,
            description: "A brief, encouraging paragraph summarizing the candidate's performance in the mock interview. It must start by stating that this is a mock interview for practice and is not a guarantee of a real visa outcome. The perspective should be that of a helpful visa interview trainer."
        },
        detailedFeedback: {
            type: Type.ARRAY,
            description: "An array of detailed feedback for each question based on the scores, from the perspective of a visa interview trainer.",
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
                    strengths: { type: Type.STRING, description: "What the applicant did well, from a trainer's perspective (e.g., 'You did an excellent job of...')." },
                    areasForImprovement: { type: Type.STRING, description: "Specific, actionable suggestions for improvement based on low scores (e.g., 'You could strengthen your answer by...')." },
                    suggestions: { type: Type.STRING, description: "General coaching tips for a visa interview related to the question and scores." }
                },
                required: ["question", "scores", "strengths", "areasForImprovement", "suggestions"]
            }
        },
        conclusion: {
            type: Type.STRING,
            description: "A concluding statement from the visa trainer's perspective, aligned with the mock interview outcome. It should offer final words of encouragement and reiterate that the feedback is for preparation purposes and not a prediction of the real interview result."
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
    ? "The mock interview outcome is 'Approved'. The feedback should be positive and reinforcing, highlighting what the applicant did well to achieve this result, while still offering minor tips for polishing their performance."
    : "The mock interview outcome is 'Refused'. The feedback must be constructive, empathetic, and clear. It should explain the likely reasons for this outcome based on the scores (e.g., weak demonstration of non-immigrant intent, lack of confidence, inconsistent answers) and provide actionable suggestions for what the applicant needs to improve.";

  return `
    You are an expert visa interview trainer providing detailed feedback on a mock interview session. Your goal is to help the applicant improve their performance for their real U.S. visa interview.

    **Important:** Your feedback must always clarify that this is a mock interview and the outcome is not a guarantee of their real visa result. This is a training exercise.

    Applicant Details:
    - Applicant Name: ${details.name}
    - Reference Number: ${details.referenceNumber}
    - Session Number: ${details.sessionNumber}
    - Visa Type Applied For: ${details.course}
    - Interview Date: ${details.date}
    - Assessment ID: ${details.id}
    - Mock Interview Outcome: ${details.decision}

    ${decisionText}

    The scores are on a scale of 1 to 10 for four parameters crucial for a visa interview:
    - Fluency & Confidence: Clarity of speech, confidence, and straightforwardness. (1=Hesitant/Nervous, 10=Clear/Confident)
    - Facial Expressions & Eye Contact: Appears trustworthy and engaging. (1=Avoidant/Anxious, 10=Trustworthy/Engaging)
    - Body Language & Poise: Posture and gestures indicating calmness and honesty. (1=Fidgety/Closed-off, 10=Composed/Confident)
    - Context & Credibility: Answer is directly relevant, credible, and demonstrates non-immigrant intent. (1=Irrelevant/Inconsistent, 10=Credible/Well-structured)

    Here are the questions asked and the scores the applicant received:

    ${scoresText}

    Please provide a detailed analysis from the perspective of a visa interview coach. Address the feedback directly to the applicant, ${details.name}.
    1.  **Overall Summary:** Start with a summary of their performance. **Crucially, begin this section by stating this was a mock interview and the feedback is for practice purposes, not a guarantee of a real visa.**
    2.  **Detailed Feedback:** For each question, analyze the scores. Highlight strengths and identify specific, actionable areas for improvement.
    3.  **Conclusion:** Provide a concluding statement that aligns with the mock interview outcome and offers final words of encouragement and advice. **Reiterate that this feedback is to help them prepare and is not a prediction of their actual interview outcome.**

    The tone of the entire response must be professional, encouraging, and constructive, like a trainer helping a student succeed.

    Return the feedback in the specified JSON format.
  `;
};


// --- Vercel Function Handler ---
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { scores, details } = req.body;

    if (!scores || !details) {
        return res.status(400).json({ error: "Missing scores or details in request body." });
    }

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
    
    // After getting feedback, save the entire record to the Supabase database
    const feedbackData = JSON.parse(responseText);
    
    const { error: insertError } = await supabase
      .from('assessments')
      .insert({
        id: details.id,
        interview_details: details,
        feedback_data: feedbackData
      });

    if (insertError) {
      // Log the error but still send feedback to the user
      console.error("Supabase insert error:", insertError);
      // In a production app, you might want to handle this more gracefully
      // For now, we will throw it so the client knows the save failed.
      throw new Error(`Failed to save assessment to database: ${insertError.message}`);
    }
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(responseText);

  } catch (error) {
    console.error("Error in Vercel function:", error);
    return res.status(500).json({ error: error.message || "An error occurred while generating feedback." });
  }
}