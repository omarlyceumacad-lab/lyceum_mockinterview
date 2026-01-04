
import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
       <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg max-w-2xl w-full">
        <div className="flex justify-center items-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {message || 'Analyzing Data...'}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This may take a moment. Please wait.
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;