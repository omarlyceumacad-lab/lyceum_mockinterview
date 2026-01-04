
// FIX: Import useState and useCallback from React to fix 'Cannot find name' errors and correct a syntax error in the import statement.
import React, { useState, useCallback, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import InterviewScreen from './components/InterviewScreen';
import LoadingScreen from './components/LoadingScreen';
import FeedbackReport from './components/FeedbackReport';
import HistoryScreen from './components/HistoryScreen';
import { generateFeedback, getHistory, deleteAssessment, getSessionCount, getCustomQuestions, addCustomQuestion } from './services/geminiService';
import { AppState, FeedbackData, InterviewDetails, AssessmentResult, AssessmentHistoryEntry } from './types';
import { INTERVIEW_QUESTIONS } from './constants';
import { generateSerialNumber } from './utils/serialNumber';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.History);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  
  const [questions, setQuestions] = useState<string[]>(INTERVIEW_QUESTIONS.map(q => q.question));
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistoryEntry[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
        try {
            setIsHistoryLoading(true);
            const [history, customQuestions] = await Promise.all([
                getHistory(),
                getCustomQuestions()
            ]);
            setAssessmentHistory(history);

            // Combine default questions with custom questions from DB and remove duplicates
            const allQuestions = [...INTERVIEW_QUESTIONS.map(q => q.question), ...customQuestions];
            const uniqueQuestions = [...new Set(allQuestions)];
            setQuestions(uniqueQuestions);

        } catch (e) {
            console.error("Failed to load initial data:", e);
            setError("Could not load assessment history or custom questions from the database.");
        } finally {
            setIsHistoryLoading(false);
        }
    };
    loadInitialData();
  }, []);

  const handleStartSetup = () => {
    setSelectedFeedback(null);
    setError(null);
    setAppState(AppState.Setup);
  };

  const handleStartAssessment = async (details: Omit<InterviewDetails, 'id' | 'sessionNumber'>) => {
    setAppState(AppState.Assessing);
    setError(null);
    try {
        let sessionCount = 0;
        if (details.referenceNumber) {
            const data = await getSessionCount(details.referenceNumber);
            sessionCount = data.count;
        }

        const newDetails: InterviewDetails = {
            ...details,
            id: generateSerialNumber(),
            sessionNumber: sessionCount + 1,
        };
        
        setSelectedFeedback({
            interviewDetails: newDetails,
            overallSummary: '',
            detailedFeedback: [],
            conclusion: ''
        });
        setAppState(AppState.Interview);

    } catch (e) {
        console.error("Failed to get session count:", e);
        setError("Could not retrieve session count. Please try again.");
        setAppState(AppState.Setup);
    }
  };
  
  const handleViewHistory = (feedback: FeedbackData) => {
    setSelectedFeedback(feedback);
    setAppState(AppState.Feedback);
  };

  const handleAssessmentComplete = useCallback(async (result: AssessmentResult) => {
    if (!selectedFeedback?.interviewDetails) {
        setError("Interview details are missing. Please restart.");
        setAppState(AppState.Setup);
        return;
    }
    const finalDetails: InterviewDetails = { 
      ...selectedFeedback.interviewDetails, 
      decision: result.decision 
    };

    setAppState(AppState.Assessing);

    try {
      const generatedFeedback = await generateFeedback(result.scores, finalDetails);
      
      const newHistoryEntry: AssessmentHistoryEntry = {
        id: finalDetails.id,
        interviewDetails: finalDetails,
        feedbackData: generatedFeedback,
      };

      // Optimistically update UI
      setAssessmentHistory(prev => [newHistoryEntry, ...prev]);
      setSelectedFeedback(generatedFeedback);
      setAppState(AppState.Feedback);
    } catch (e) {
      console.error(e);
      setError('Sorry, there was an error generating feedback. Please try again.');
      setAppState(AppState.Interview); 
    }
  }, [selectedFeedback]);
  
  const handleAddCustomQuestion = useCallback(async (newQuestion: string) => {
    setError(null); // Clear previous errors
    const trimmedQuestion = newQuestion.trim();
    if (trimmedQuestion && !questions.includes(trimmedQuestion)) {
        setQuestions(prev => [...prev, trimmedQuestion]);
        try {
            await addCustomQuestion(trimmedQuestion);
        } catch (e) {
            console.error("Failed to save new question:", e);
            setQuestions(prev => prev.filter(q => q !== trimmedQuestion));
            setError("Could not save the new question. Please try again.");
            setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
        }
    }
  }, [questions]);

  const handleBackToHistory = () => {
    setSelectedFeedback(null);
    setError(null);
    setAppState(AppState.History);
  }

  const handleDeleteAssessment = useCallback(async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
        return;
    }
    try {
        await deleteAssessment(id);
        setAssessmentHistory(prev => prev.filter(entry => entry.id !== id));
    } catch (e) {
        console.error("Failed to delete assessment:", e);
        setError("Could not delete the assessment. Please try again.");
    }
  }, []);

  const renderContent = () => {
    if (isHistoryLoading && appState === AppState.History) {
      return <LoadingScreen />;
    }

    switch (appState) {
      case AppState.History:
        return <HistoryScreen history={assessmentHistory} onStart={handleStartSetup} onView={handleViewHistory} onDelete={handleDeleteAssessment} />;
      case AppState.Setup:
        return <SetupScreen onStart={handleStartAssessment} onBack={handleBackToHistory} />;
      case AppState.Interview:
        if (!selectedFeedback?.interviewDetails) {
            return <LoadingScreen message="Preparing assessment..." />;
        }
        return (
          <InterviewScreen
            interviewDetails={selectedFeedback.interviewDetails}
            onComplete={handleAssessmentComplete}
            apiError={error}
            questions={questions}
            onAddCustomQuestion={handleAddCustomQuestion}
          />
        );
      case AppState.Assessing:
        return <LoadingScreen message="Generating AI Feedback Report..." />;
      case AppState.Feedback:
        return selectedFeedback ? (
            <FeedbackReport 
                feedbackData={selectedFeedback} 
                interviewDetails={selectedFeedback.interviewDetails}
                onRestart={handleBackToHistory} 
            />
        ) : <LoadingScreen />;
      default:
        return <HistoryScreen history={assessmentHistory} onStart={handleStartSetup} onView={handleViewHistory} onDelete={handleDeleteAssessment} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;