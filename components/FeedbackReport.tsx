
import React, { useRef } from 'react';
import { FeedbackData, ScoreParameters, InterviewDetails, HiringDecision } from '../types';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface FeedbackReportProps {
  feedbackData: FeedbackData;
  interviewDetails: InterviewDetails;
  onRestart: () => void;
}

const ScoreDisplay: React.FC<{ scores: ScoreParameters }> = ({ scores }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Fluency</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{scores.fluency}/10</div>
        </div>
        <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Expressions</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{scores.facialExpressions}/10</div>
        </div>
        <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Body Language</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{scores.bodyLanguage}/10</div>
        </div>
        <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Credibility</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{scores.context}/10</div>
        </div>
    </div>
);


const FeedbackCard: React.FC<{ title: string, children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
            <div className="text-indigo-500 mr-3">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="text-gray-600 dark:text-gray-300 space-y-2">{children}</div>
    </div>
);

const PrintableReport: React.FC<{ feedbackData: FeedbackData; interviewDetails: InterviewDetails, reportRef: React.Ref<HTMLDivElement> }> = ({ feedbackData, interviewDetails, reportRef }) => {
    const isApproved = interviewDetails.decision === HiringDecision.Approved;
    return (
        <div ref={reportRef} className="absolute top-0 -left-[9999px]" style={{width: '210mm', height: '297mm'}}>
             <div className="p-12 bg-white text-black font-serif h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center border-b-2 border-gray-400 pb-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">Lyceum Academy</h1>
                        <p className="text-sm text-gray-600">www.lyceumacad.com | +91 78930 78791</p>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700">Visa Feedback Report</h2>
                </div>

                <div className="grow">
                    {/* Candidate Info */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-lg border-b border-gray-300 pb-4">
                        <p><strong>Applicant:</strong> {interviewDetails.name}</p>
                        <p><strong>Visa Type:</strong> {interviewDetails.course}</p>
                        <p><strong>Date:</strong> {interviewDetails.date}</p>
                        <p><strong>Assessment ID:</strong> {interviewDetails.id}</p>
                        <p className={`font-bold ${isApproved ? 'text-green-700' : 'text-red-700'}`}><strong>Decision:</strong> {interviewDetails.decision}</p>
                    </div>

                    {/* Overall Summary */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3 text-gray-800">Overall Summary</h3>
                        <p className="text-gray-700 text-justify">{feedbackData.overallSummary}</p>
                    </div>
                    
                    {/* Detailed Feedback */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3 text-gray-800">Detailed Question Analysis</h3>
                        {feedbackData.detailedFeedback.map((item, index) => (
                            <div key={index} className="mb-4 break-inside-avoid">
                                <h4 className="font-bold text-lg text-gray-900">{index + 1}. {item.question}</h4>
                                <div className="pl-4 border-l-2 border-gray-200 ml-1">
                                    <p className="text-gray-700"><strong>Strengths:</strong> {item.strengths}</p>
                                    <p className="text-gray-700"><strong>Areas for Improvement:</strong> {item.areasForImprovement}</p>
                                    <p className="text-gray-700"><strong>Suggestions:</strong> {item.suggestions}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Conclusion */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3 text-gray-800">Conclusion</h3>
                        <p className="text-gray-700 text-justify">{feedbackData.conclusion}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-400">
                    <p>Report generated by Lyceum Academy AI Interview Assessor</p>
                    <p>www.lyceumacad.com | +91 78930 78791</p>
                </div>
            </div>
        </div>
    );
};

const FeedbackReport: React.FC<FeedbackReportProps> = ({ feedbackData, interviewDetails, onRestart }) => {
  const printableReportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    const { jsPDF } = window.jspdf;
    const input = printableReportRef.current;
    if (!input) return;

    window.html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${interviewDetails.name}-feedback-report.pdf`);
    });
  };
  
  const handleSendEmail = () => {
    const subject = `Visa Interview Feedback for ${interviewDetails.name}`;
    const body = `Hi ${interviewDetails.name},\n\nPlease find the AI-generated feedback report for your recent mock visa interview attached.\n\nAssessment ID: ${interviewDetails.id}\n\n(Remember to attach the PDF you just downloaded).`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const icons = {
      summary: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
      conclusion: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.65-3.8a9 9 0 1 1 3.42 2.9l-5.07.9z"></path></svg>,
      question: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
      strength: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>,
      improvement: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"></path><path d="m19 19-7-7 7-7"></path></svg>,
      suggestion: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15.232 5.232 3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
  };

  const isApproved = interviewDetails.decision === HiringDecision.Approved;

  return (
    <>
      <PrintableReport 
        reportRef={printableReportRef} 
        feedbackData={feedbackData} 
        interviewDetails={interviewDetails}
      />
      <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">Applicant Feedback Report</h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8">Review the AI-generated analysis of the mock visa interview.</p>
          
          <div className="sticky top-4 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl z-10 mb-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleDownloadPdf} className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download PDF
              </button>
              <button onClick={handleSendEmail} className="flex items-center justify-center gap-2 bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-transform transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Share via Email
              </button>
              <button onClick={onRestart} className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-transform transform hover:scale-105">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9H21M3 6H21M3 12H21M3 15H11M3 18H11" /></svg>
                  Back to History
              </button>
          </div>

          <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-center mb-8 border-b-2 border-indigo-200 dark:border-indigo-800 pb-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Visa Interview Feedback Report</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">For: <span className="font-semibold">{interviewDetails.name}</span></p>
                  <p className="text-md text-gray-500 dark:text-gray-500">Visa Type: {interviewDetails.course} | Date: {interviewDetails.date}</p>
                   <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Assessment ID: {interviewDetails.id}</p>
              </div>

              <div className={`p-4 rounded-lg mb-8 text-center ${isApproved ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                  <h3 className={`text-2xl font-bold ${isApproved ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                      Final Decision: {interviewDetails.decision}
                  </h3>
              </div>
              
              <FeedbackCard title="Overall Summary" icon={icons.summary}>
                  <p>{feedbackData.overallSummary}</p>
              </FeedbackCard>

              <h3 className="text-2xl font-bold my-8 text-center text-gray-900 dark:text-white">Detailed Question Analysis</h3>

              {feedbackData.detailedFeedback.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-4">
                          <div className="text-indigo-500 mr-3">{icons.question}</div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.question}</h4>
                      </div>
                      <ScoreDisplay scores={item.scores} />
                      
                      <div className="flex items-start mb-3">
                          <div className="text-green-500 mt-1 mr-3 flex-shrink-0">{icons.strength}</div>
                          <div>
                              <h5 className="font-semibold text-gray-800 dark:text-gray-100">Strengths:</h5>
                              <p className="text-gray-600 dark:text-gray-300">{item.strengths}</p>
                          </div>
                      </div>
                      <div className="flex items-start mb-3">
                          <div className="text-yellow-500 mt-1 mr-3 flex-shrink-0">{icons.improvement}</div>
                          <div>
                              <h5 className="font-semibold text-gray-800 dark:text-gray-100">Areas for Improvement:</h5>
                              <p className="text-gray-600 dark:text-gray-300">{item.areasForImprovement}</p>
                          </div>
                      </div>
                       <div className="flex items-start">
                          <div className="text-blue-500 mt-1 mr-3 flex-shrink-0">{icons.suggestion}</div>
                          <div>
                              <h5 className="font-semibold text-gray-800 dark:text-gray-100">Suggestions:</h5>
                              <p className="text-gray-600 dark:text-gray-300">{item.suggestions}</p>
                          </div>
                      </div>
                  </div>
              ))}

              <FeedbackCard title="Conclusion" icon={icons.conclusion}>
                  <p>{feedbackData.conclusion}</p>
              </FeedbackCard>
          </div>
      </div>
    </>
  );
};

export default FeedbackReport;
