
import React from 'react';
import { AssessmentHistoryEntry, FeedbackData, HiringDecision } from '../types';

interface HistoryScreenProps {
  history: AssessmentHistoryEntry[];
  onStart: () => void;
  onView: (feedback: FeedbackData) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onStart, onView }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Assessment History</h1>
        <button
          onClick={onStart}
          className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all transform hover:scale-105"
        >
          New Assessment
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        {history.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map(entry => (
              <li key={entry.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{entry.interviewDetails.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.interviewDetails.course} | {entry.interviewDetails.date}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">ID: {entry.id}</p>
                </div>
                <div className="flex items-center gap-4 mt-3 sm:mt-0">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      entry.interviewDetails.decision === HiringDecision.Approved
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {entry.interviewDetails.decision}
                  </span>
                  <button
                    onClick={() => onView(entry.feedbackData)}
                    className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    View Report
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No assessments yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Click "New Assessment" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
