import {
  formatDate,
  getQuestions,
  submitAnswer,
  submitQuestion
} from "@/lib/reviewQuestionUtils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QnASection = ({ productId }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState({});
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const questionsData = await getQuestions(productId);
      setQuestions(questionsData);
    };
    
    fetchQuestions();
  }, [productId]);

  // Ask a New Question
  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newQ = await submitQuestion(productId, newQuestion);
      setQuestions([newQ, ...questions]);
      setNewQuestion("");
    } catch (error) {
      console.error("Failed to submit question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit an Answer
  const handleAnswer = async (questionId) => {
    if (!answers[questionId]?.trim()) return;
    
    setIsSubmitting(true);
    try {
      const updatedQ = await submitAnswer(questionId, answers[questionId]);
      setQuestions(questions.map((q) => (q.questionId === questionId ? updatedQ : q)));
      setAnswers({ ...answers, [questionId]: "" });
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header with elegant styling */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-l-4 border-amber-400 pl-4 mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800">Customer Questions & Answers</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-amber-300 to-amber-100 mt-2"></div>
      </motion.div>

      {/* Ask a Question */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 bg-gradient-to-br from-amber-50 to-white p-6 rounded-lg border border-amber-100 shadow-sm"
      >
        <div className="flex items-center space-x-2 mb-3">
          <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-600 text-xs">❓</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Ask a Question</h3>
        </div>
        
        <textarea
          className="w-full p-3 border text-black border-gray-200 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all bg-white"
          placeholder="What would you like to know about this product?"
          rows="3"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        ></textarea>
        
        <div className="flex justify-end mt-3">
          <button 
            onClick={handleAskQuestion} 
            disabled={isSubmitting || !newQuestion.trim()} 
            className={`px-5 py-2 rounded-md font-medium transition-all duration-300 ${
              isSubmitting || !newQuestion.trim() 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:shadow-md hover:from-amber-500 hover:to-amber-600'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Question'}
          </button>
        </div>
      </motion.div>

      {/* Questions List */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-600 text-xs">✧</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">{questions.length} Questions</h3>
        </div>
        
        {questions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-amber-100">
              <span className="text-amber-500 text-2xl">?</span>
            </div>
            <p className="text-gray-500 mb-2">No questions yet.</p>
            <p className="text-gray-700 font-medium">Be the first to ask about this product!</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {questions.map((q) => (
              <motion.div 
                key={q._id} 
                variants={itemVariants}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div 
                  className="bg-gradient-to-r from-amber-50 to-white p-4 cursor-pointer hover:bg-amber-100/30 transition-colors duration-300"
                  onClick={() => setExpandedQuestion(expandedQuestion === q._id ? null : q._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-800">{q.question}</p>
                      <div className="text-sm text-gray-500 mt-2 flex items-center">
                        <span className="inline-block h-6 w-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs mr-2">
                          {q.username.charAt(0).toUpperCase()}
                        </span>
                        Asked by {q.username} on {formatDate(q.date)}
                      </div>
                    </div>
                    <div className="text-amber-500 transition-transform duration-300 transform">
                      {expandedQuestion === q._id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedQuestion === q._id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-white border-t border-gray-100">
                        {/* Display Answers */}
                        {q.answers.length > 0 ? (
                          <div className="mb-5">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                              <span className="inline-block h-5 w-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs mr-2">
                                A
                              </span>
                              Answers:
                            </h4>
                            <ul className="space-y-3">
                              {q.answers.map((a, idx) => (
                                <li key={idx} className="bg-gradient-to-r from-amber-50 to-white p-4 rounded-md border border-amber-100/50">
                                  <div className="flex items-center mb-2">
                                    <span className="font-medium text-amber-700">{a.name}</span>
                                    <span className="text-gray-400 text-xs ml-2">{formatDate(a.date)}</span>
                                    {a?.role && (
                                      <span className="text-amber-600 border border-amber-300 px-1.5 py-0.5 rounded-lg text-xs ml-2 bg-amber-50">
                                        {a.role}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-700">{a.answer}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="mb-4 p-3 border border-dashed border-amber-200 rounded-md bg-amber-50/30 text-center">
                            <p className="text-gray-500 text-sm italic">No answers yet. Be the first to answer!</p>
                          </div>
                        )}

                        {/* Answer Form */}
                        <div className="border-t border-amber-100 pt-4">
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            <span className="inline-block h-5 w-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs mr-2">
                              ✓
                            </span>
                            Add Your Answer:
                          </h4>
                          <textarea
                            className="w-full p-3 border border-gray-200 rounded-md text-sm mb-3 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 bg-white"
                            placeholder="Share your knowledge or experience..."
                            rows="2"
                            value={answers[q.questionId] || ""}
                            onChange={(e) => setAnswers({ ...answers, [q.questionId]: e.target.value })}
                          ></textarea>
                          <button 
                            onClick={() => handleAnswer(q.questionId)} 
                            disabled={isSubmitting || !answers[q.questionId]?.trim()}
                            className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                              isSubmitting || !answers[q.questionId]?.trim()
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:shadow-sm hover:from-amber-500 hover:to-amber-600'
                            }`}
                          >
                            {isSubmitting ? 'Posting...' : 'Post Answer'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QnASection;