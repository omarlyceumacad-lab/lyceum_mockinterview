

// FIX: Import useState and useCallback from React to fix 'Cannot find name' errors and correct a syntax error in the import statement.
import React, { useState, useCallback } from 'react';
import SetupScreen from './components/SetupScreen';
import InterviewScreen from './components/InterviewScreen';
import LoadingScreen from './components/LoadingScreen';
import FeedbackReport from './components/FeedbackReport';
import HistoryScreen from './components/HistoryScreen';
import { generateFeedback } from './services/geminiService';
import { AppState, FeedbackData, InterviewDetails, AssessmentResult, AssessmentHistoryEntry } from './types';
import { INTERVIEW_QUESTIONS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateSerialNumber } from './utils/serialNumber';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.History);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [questions, setQuestions] = useLocalStorage<string[]>('interviewQuestions', INTERVIEW_QUESTIONS.map(q => q.question));
  const [assessmentHistory, setAssessmentHistory] = useLocalStorage<AssessmentHistoryEntry[]>('assessmentHistory', []);

  const handleStartSetup = () => {
    setSelectedFeedback(null);
    setError(null);
    setAppState(AppState.Setup);
  };

  const handleStartAssessment = (details: InterviewDetails) => {
    const newDetails = { ...details, id: generateSerialNumber() };
    setSelectedFeedback({
      interviewDetails: newDetails,
      overallSummary: '',
      detailedFeedback: [],
      conclusion: ''
    });
    setError(null);
    setAppState(AppState.Interview);
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

      setAssessmentHistory(prev => [newHistoryEntry, ...prev]);
      setSelectedFeedback(generatedFeedback);
      setAppState(AppState.Feedback);
    } catch (e) {
      console.error(e);
      setError('Sorry, there was an error generating feedback. Please try again.');
      setAppState(AppState.Interview); 
    }
  }, [selectedFeedback, setAssessmentHistory]);
  
  const handleBackToHistory = () => {
    setSelectedFeedback(null);
    setError(null);
    setAppState(AppState.History);
  }

  const renderContent = () => {
    switch (appState) {
      case AppState.History:
        return <HistoryScreen history={assessmentHistory} onStart={handleStartSetup} onView={handleViewHistory} />;
      case AppState.Setup:
        return <SetupScreen onStart={handleStartAssessment} onBack={handleBackToHistory} />;
      case AppState.Interview:
        if (!selectedFeedback?.interviewDetails) {
            return <LoadingScreen />;
        }
        return (
          <InterviewScreen
            interviewDetails={selectedFeedback.interviewDetails}
            onComplete={handleAssessmentComplete}
            apiError={error}
            questions={questions}
            setQuestions={setQuestions}
          />
        );
      case AppState.Assessing:
        return <LoadingScreen />;
      case AppState.Feedback:
        return selectedFeedback ? (
            <FeedbackReport 
                feedbackData={selectedFeedback} 
                interviewDetails={selectedFeedback.interviewDetails}
                onRestart={handleBackToHistory} 
            />
        ) : <LoadingScreen />;
      default:
        return <HistoryScreen history={assessmentHistory} onStart={handleStartSetup} onView={handleViewHistory} />;
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