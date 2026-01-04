
import { VisaQuestions } from './types';

export const CATEGORIZED_INTERVIEW_QUESTIONS: VisaQuestions = {
  Common: [
    {
      category: "Common Questions",
      questions: [
        "What is the purpose of your trip to the United States?",
        "Why do you want to travel to the US?",
        "Have you ever been to the United States before?",
        "Do you have any relatives in the United States?",
        "What do you do for a living in your home country?",
      ]
    }
  ],
  F1: [
    {
      category: "University",
      questions: [
        "Why did you choose this particular university?",
        "How many other universities have you applied for?",
        "Why do you want to study in the US and not in your home country?",
        "What is your chosen field of study and why?",
        "What were your previous academic scores or GPA?",
      ],
    },
    {
      category: "Sponsors",
      questions: [
        "Who will be sponsoring your trip?",
        "How will you finance your education and living expenses?",
      ],
    },
    {
      category: "Hometies",
      questions: [
        "What are your plans after you complete your studies?",
        "Do you intend to work in the U.S. after graduation?",
        "What ties do you have to your home country?",
      ],
    },
  ],
  B2: [
    {
      category: "Trip Details",
      questions: [
        "How long do you plan to stay in the US?",
        "Where will you be staying in the United States?",
        "Can you show me your proposed itinerary?",
        "Are you traveling with anyone else?",
      ],
    },
    {
      category: "Sponsor",
      questions: ["Who will be sponsoring your trip?"],
    },
    {
      category: "Home Ties",
      questions: [
        "How can you assure me that you will return to your home country?",
        "What ties do you have to your home country?",
      ],
    },
  ],
  F2: [
    {
      category: "About Spouse",
      questions: [
        "What is your spouse's name and what are they studying/doing in the US?",
        "Where is your spouse's university/place of work?",
        "When did you get married?",
        "Can I see your marriage certificate and wedding photos?",
      ],
    },
    {
      category: "Sponsor",
      questions: [
        "Who is sponsoring your trip and stay?",
        "What is your spouse's source of funding?",
      ],
    },
    {
      category: "Home Ties",
      questions: [
        "What are your plans after your spouse finishes their studies/work assignment?",
        "Do you intend to work in the US?",
        "What ties do you have to your home country?",
      ],
    },
  ],
};