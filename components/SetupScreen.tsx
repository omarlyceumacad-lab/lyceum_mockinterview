
import React, { useState } from 'react';
import { InterviewDetails } from '../types';

interface SetupScreenProps {
  onStart: (details: Omit<InterviewDetails, 'id' | 'sessionNumber' | 'time'>) => void;
  onBack: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, onBack }) => {
  const [name, setName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [visaType, setVisaType] = useState('F1');
  const [studentCourse, setStudentCourse] = useState('');
  const [otherVisaType, setOtherVisaType] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDateScheduled, setIsDateScheduled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalCourse = visaType;
    if (visaType === 'F1') {
        finalCourse = studentCourse ? `F1 - ${studentCourse}` : 'F1 Student';
    } else if (visaType === 'Others') {
        finalCourse = otherVisaType || 'Other';
    }
    
    const finalDetails = {
        name,
        referenceNumber,
        course: finalCourse,
        date: isDateScheduled ? date : 'Not Scheduled'
    };

    onStart(finalDetails);
  };

  const isFormInvalid = 
    !name.trim() || 
    !referenceNumber.trim() ||
    (visaType === 'F1' && !studentCourse.trim()) || 
    (visaType === 'Others' && !otherVisaType.trim()) || 
    (isDateScheduled && !date);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Applicant Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reference Number
              </label>
              <input
                type="text"
                id="referenceNumber"
                name="referenceNumber"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="From your CRM"
              />
            </div>
          </div>
          <div>
            <label htmlFor="visaType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Visa Type Applied For
            </label>
            <select
              id="visaType"
              name="visaType"
              value={visaType}
              onChange={(e) => setVisaType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="F1">F1 - Student Visa</option>
              <option value="B2">B2 - Visitor Visa</option>
              <option value="F2">F2 - Dependent Visa</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {visaType === 'F1' && (
            <div>
              <label htmlFor="studentCourse" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Student Course
              </label>
              <input
                type="text"
                id="studentCourse"
                name="studentCourse"
                value={studentCourse}
                onChange={(e) => setStudentCourse(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., MS in Computer Science"
              />
            </div>
          )}

          {visaType === 'Others' && (
            <div>
              <label htmlFor="otherVisaType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Specify Other Visa Type
              </label>
              <input
                type="text"
                id="otherVisaType"
                name="otherVisaType"
                value={otherVisaType}
                onChange={(e) => setOtherVisaType(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., H1-B"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Interview Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={!isDateScheduled}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
            />
             <div className="mt-2 flex items-center">
                <input
                    id="not-scheduled"
                    name="not-scheduled"
                    type="checkbox"
                    checked={!isDateScheduled}
                    onChange={(e) => setIsDateScheduled(!e.target.checked)}
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