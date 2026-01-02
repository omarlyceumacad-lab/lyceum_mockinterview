
import React, { useState } from 'react';
import { Scores, ScoreParameters, HiringDecision, AssessmentResult, InterviewDetails } from '../types';

interface InterviewScreenProps {
  interviewDetails: InterviewDetails;
  onComplete: (result: AssessmentResult) => void;
  apiError: string | null;
  questions: string[];
  setQuestions: (value: string[] | ((val: string[]) => string[])) => void;
}

const ScoreSlider: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex justify-between">
            <span>{label}</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{value} / 10</span>
        </label>
        <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
    </div>
);


const InterviewScreen: React.FC<InterviewScreenProps> = ({ interviewDetails, onComplete, apiError, questions, setQuestions }) => {
  const [scores, setScores] = useState<Scores[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [decision, setDecision] = useState<HiringDecision>(HiringDecision.Pending);
  const [currentScores, setCurrentScores] = useState<ScoreParameters>({
      fluency: 5,
      facialExpressions: 5,
      bodyLanguage: 5,
      context: 5,
  });

  const handleAddQuestion = () => {
    const trimmedQuestion = currentQuestion.trim();
    if (!trimmedQuestion) return;

    const newScore: Scores = {
      question: trimmedQuestion,
      ...currentScores,
    };
    
    setScores(prevScores => [...prevScores, newScore]);
    
    if (!questions.includes(trimmedQuestion)) {
        setQuestions(prev => [...prev, trimmedQuestion]);
    }

    setCurrentQuestion('');
    setCurrentScores({ fluency: 5, facialExpressions: 5, bodyLanguage: 5, context: 5 });
  };
  
  const handleFinish = () => {
      if (decision === HiringDecision.Pending) {
          alert("Please select a final decision (Approved/Refused) before finishing.");
          return;
      }
      onComplete({ scores, decision });
  }

  const isAddDisabled = !currentQuestion.trim();
  const isFinishDisabled = scores.length === 0;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Visa Interview Assessment
          </h2>
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            For: {interviewDetails.name} ({interviewDetails.course}) - ID: {interviewDetails.id}
          </p>
          
          {apiError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
              <p className="font-bold">Error</p>
              <p>{apiError}</p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="question-input" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Select or Enter Interview Question
            </label>
            <input
                id="question-input"
                type="text"
                list="questions-datalist"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                placeholder="e.g., What is the purpose of your trip?"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <datalist id="questions-datalist">
                {questions.map((q, i) => <option key={i} value={q} />)}
            </datalist>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <ScoreSlider label="Fluency & Confidence" value={currentScores.fluency} onChange={(v) => setCurrentScores(s => ({...s, fluency: v}))} />
              <ScoreSlider label="Facial Expressions" value={currentScores.facialExpressions} onChange={(v) => setCurrentScores(s => ({...s, facialExpressions: v}))} />
              <ScoreSlider label="Body Language & Poise" value={currentScores.bodyLanguage} onChange={(v) => setCurrentScores(s => ({...s, bodyLanguage: v}))} />
              <ScoreSlider label="Context & Credibility" value={currentScores.context} onChange={(v) => setCurrentScores(s => ({...s, context: v}))} />
          </div>

          <div className="mt-8 border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Final Visa Decision</h3>
            <div className="flex items-center gap-4">
                <label className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors w-1/2 ${decision === HiringDecision.Approved ? 'bg-green-100 dark:bg-green-900 border-green-500' : 'bg-gray-100 dark:bg-gray-700 border-transparent'} border-2`}>
                    <input type="radio" name="decision" value={HiringDecision.Approved} checked={decision === HiringDecision.Approved} onChange={() => setDecision(HiringDecision.Approved)} className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300" />
                    <span className="ml-3 font-medium text-green-800 dark:text-green-300">Approved</span>
                </label>
                 <label className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors w-1/2 ${decision === HiringDecision.Refused ? 'bg-red-100 dark:bg-red-900 border-red-500' : 'bg-gray-100 dark:bg-gray-700 border-transparent'} border-2`}>
                    <input type="radio" name="decision" value={HiringDecision.Refused} checked={decision === HiringDecision.Refused} onChange={() => setDecision(HiringDecision.Refused)} className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300" />
                    <span className="ml-3 font-medium text-red-800 dark:text-red-300">Refused</span>
                </label>
            </div>
          </div>


          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={handleAddQuestion}
              disabled={isAddDisabled}
              className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all disabled:bg-gray-200 disabled:dark:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Add Question
            </button>
            <button
              onClick={handleFinish}
              disabled={isFinishDisabled}
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
            >
              Finish & Get Feedback
            </button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Scored Questions ({scores.length})</h3>
            {scores.length > 0 ? (
                <ul className="space-y-3">
                    {scores.map((s, i) => (
                        <li key={i} className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                           <span className="font-semibold">{i + 1}.</span> {s.question}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 pt-8">
                    <p>Your scored questions will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default InterviewScreen;