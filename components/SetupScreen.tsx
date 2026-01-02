
import React, { useState } from 'react';
import { InterviewDetails } from '../types';

interface SetupScreenProps {
  onStart: (details: Omit<InterviewDetails, 'id'>) => void;
  onBack: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, onBack }) => {
  const [details, setDetails] = useState({
    name: '',
    course: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isDateScheduled, setIsDateScheduled] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDateScheduled(!e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDetails = {
        ...details,
        date: isDateScheduled ? details.date : 'Not Scheduled'
    };
    if (details.name.trim() && details.course.trim() && finalDetails.date) {
      onStart(finalDetails);
    }
  };

  const isFormInvalid = !details.name.trim() || !details.course.trim() || (isDateScheduled && !details.date);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-lg max-w-lg w-full relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          New Assessment
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-300 mb-8 text-center">
          Enter applicant details to begin the mock interview.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Applicant Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={details.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Visa Type Applied For
            </label>
            <input
              type="text"
              id="course"
              name="course"
              value={details.course}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., F-1 Student, B-2 Visitor"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Interview Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={details.date}
              onChange={handleChange}
              required
              disabled={!isDateScheduled}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
            />
             <div className="mt-2 flex items-center">
                <input
                    id="not-scheduled"
                    name="not-scheduled"
                    type="checkbox"
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="not-scheduled" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Not yet scheduled
                </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={isFormInvalid}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
          >
            Start Assessment
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;