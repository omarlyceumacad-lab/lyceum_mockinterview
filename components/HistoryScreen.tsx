
import React, { useState, useMemo } from 'react';
import { AssessmentHistoryEntry, FeedbackData, HiringDecision } from '../types';

interface HistoryScreenProps {
  history: AssessmentHistoryEntry[];
  onStart: () => void;
  onView: (feedback: FeedbackData) => void;
  onDelete: (id: string) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onStart, onView, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return history;
    }
    return history.filter(entry =>
      entry.interviewDetails.name.toLowerCase().includes(query) ||
      entry.id.toLowerCase().includes(query)
    );
  }, [history, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Assessment History</h1>
        <button
          onClick={onStart}
          className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all transform hover:scale-105 w-full sm:w-auto"
        >
          New Assessment
        </button>
      </div>

       <div className="mb-6">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or assessment ID..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                aria-label="Search assessments"
            />
        </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        {filteredHistory.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredHistory.map(entry => (
              <li key={entry.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-grow">
                  <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{entry.interviewDetails.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.interviewDetails.course} | {entry.interviewDetails.date}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">ID: {entry.id}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
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
                    View
                  </button>
                   <button
                    onClick={() => onDelete(entry.id)}
                    className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 font-bold py-2 px-4 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Delete assessment for ${entry.interviewDetails.name}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No assessments found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {searchQuery ? 'Try adjusting your search query.' : 'Click "New Assessment" to get started.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;