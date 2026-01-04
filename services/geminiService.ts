
import { Scores, FeedbackData, InterviewDetails, AssessmentHistoryEntry } from "../types";

const GENERATE_FEEDBACK_ENDPOINT = '/api/generate-feedback';
const HISTORY_ENDPOINT = '/api/history';
const DELETE_ASSESSMENT_ENDPOINT = '/api/delete-assessment';
const GET_SESSION_COUNT_ENDPOINT = '/api/get-session-count';
const GET_QUESTIONS_ENDPOINT = '/api/get-questions';
const ADD_QUESTION_ENDPOINT = '/api/add-question';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.error || JSON.stringify(errorBody);
    } catch (e) {
      // Response was not JSON, which can happen on a server crash
      const textError = await response.text();
      if (textError.includes('INTERNAL_SERVER_ERROR') || textError.includes('NOT_FOUND') || response.status === 500) {
          errorMessage = "The API endpoint is not working correctly. Please check the server logs on Vercel for more details. This is often caused by missing environment variables.";
      } else if (textError) {
          errorMessage = textError;
      }
    }
    console.error("API Function Error:", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    // Handle cases where the response might be empty (e.g., for a successful DELETE request)
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (error) {
    console.error("Failed to parse JSON response from function:", error);
    throw new Error("The server returned an invalid response format.");
  }
}


export const generateFeedback = async (scores: Scores[], details: InterviewDetails, aiNote?: string): Promise<FeedbackData> => {
  const response = await fetch(GENERATE_FEEDBACK_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scores, details, aiNote }),
  });

  return handleResponse<FeedbackData>(response);
};

export const getHistory = async (): Promise<AssessmentHistoryEntry[]> => {
    const response = await fetch(HISTORY_ENDPOINT);
    return handleResponse<AssessmentHistoryEntry[]>(response);
}

export const deleteAssessment = async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${DELETE_ASSESSMENT_ENDPOINT}?id=${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
};

export const getSessionCount = async (referenceNumber: string): Promise<{ count: number }> => {
    const response = await fetch(`${GET_SESSION_COUNT_ENDPOINT}?referenceNumber=${encodeURIComponent(referenceNumber)}`);
    return handleResponse<{ count: number }>(response);
};

export const getCustomQuestions = async (): Promise<string[]> => {
    const response = await fetch(GET_QUESTIONS_ENDPOINT);
    return handleResponse<string[]>(response);
};

export const addCustomQuestion = async (question: string): Promise<{ message: string }> => {
    const response = await fetch(ADD_QUESTION_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    });
    return handleResponse<{ message: string }>(response);
};