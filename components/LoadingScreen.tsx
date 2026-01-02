
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
       <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg max-w-2xl w-full">
        <div className="flex justify-center items-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Generating AI Feedback Report...
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Our AI is preparing a personalized report based on your assessment. This may take a moment.
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
