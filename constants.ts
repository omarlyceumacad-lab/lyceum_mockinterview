
import { InterviewQuestion } from './types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // Common for both Student and Visitor Visas
  { id: 1, question: "What is the purpose of your trip to the United States?" },
  { id: 2, question: "Why do you want to travel to the US?" },
  { id: 3, question: "Who will be sponsoring your trip?" },
  { id: 4, question: "Have you ever been to the United States before?" },
  { id: 5, question: "What ties do you have to your home country?" },
  { id: 6, question: "Do you have any relatives in the United States?" },
  { id: 7, question: "What do you do for a living in your home country?" },

  // F-1 Student Visa Specific
  { id: 8, question: "Why did you choose this particular university?" },
  { id: 9, question: "Why do you want to study in the US and not in your home country?" },
  { id: 10, question: "What is your chosen field of study and why?" },
  { id: 11, question: "How will you finance your education and living expenses?" },
  { id: 12, question: "What are your plans after you complete your studies?" },
  { id: 13, question: "Do you intend to work in the U.S. after graduation?" },
  { id: 14, question: "What were your previous academic scores or GPA?" },

  // B-2 Visitor Visa Specific
  { id: 15, question: "How long do you plan to stay in the US?" },
  { id: 16, question: "Where will you be staying in the United States?" },
  { id: 17, question: "Can you show me your proposed itinerary?" },
  { id: 18, question: "Are you traveling with anyone else?" },
  { id: 19, question: "How can you assure me that you will return to your home country?" },
];