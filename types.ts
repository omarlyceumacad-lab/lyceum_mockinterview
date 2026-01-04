
export enum AppState {
  History,
  Setup,
  Interview,
  Assessing,
  Feedback,
}

export enum HiringDecision {
    Approved = 'Approved',
    Refused = 'Refused',
    Pending = 'Pending',
}

export interface InterviewDetails {
    id: string; // Unique serial number for the assessment
    name: string;
    course: string; // Will represent visa type (e.g., F-1 Student, B-2 Visitor)
    date: string; // Scheduled Date
    referenceNumber?: string;
    sessionNumber?: number;
    assessmentDateTime: string;
    decision?: HiringDecision;
}

export interface InterviewQuestion {
  id: number;
  question: string;
}

export interface ScoreParameters {
  fluency: number;
  facialExpressions: number;
  bodyLanguage: number;
  context: number;
}

export interface Scores extends ScoreParameters {
  question: string;
}

export interface AssessmentResult {
    scores: Scores[];
    decision: HiringDecision;
    aiNote?: string;
}

export interface DetailedFeedback {
  question: string;
  scores: ScoreParameters;
  strengths: string;
  areasForImprovement: string;
  suggestions: string;
}

export interface FeedbackData {
  interviewDetails: InterviewDetails;
  overallSummary: string;
  detailedFeedback: DetailedFeedback[];
  conclusion: string;
}

export interface AssessmentHistoryEntry {
  id: string;
  interviewDetails: InterviewDetails;
  feedbackData: FeedbackData;
}

// New types for categorized questions
export interface CategorizedQuestionSet {
  category: string;
  questions: string[];
}

export interface VisaQuestions {
  [visaType: string]: CategorizedQuestionSet[];
}