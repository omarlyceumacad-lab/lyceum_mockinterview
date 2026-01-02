
import { Scores, FeedbackData, InterviewDetails } from "../types";

// This is the relative path to our Vercel API Route
const API_ENDPOINT = '/api/generate-feedback';

export const generateFeedback = async (scores: Scores[], details: InterviewDetails): Promise<FeedbackData> => {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scores, details }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: "An unknown server error occurred." }));
    console.error("API Function Error:", errorBody);
    throw new Error(errorBody.error || "Failed to get feedback from the server.");
  }
  
  // The Gemini response is a string that needs to be parsed into JSON.
  // Our function now forwards this string directly.
  try {
    const responseText = await response.text();
    const feedbackData: FeedbackData = JSON.parse(responseText);
    return feedbackData;
  } catch (error) {
     console.error("Failed to parse JSON response from function:", error);
    throw new Error("The server returned an invalid response format.");
  }
};
