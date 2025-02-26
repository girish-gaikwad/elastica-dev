import { useState, useEffect } from "react";

const QnASection = ({ productId }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState({});
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Questions
  useEffect(() => {
    fetch(`/api/questions/${productId}`)
      .then((res) => res.json())
      .then(setQuestions)
      .catch(console.error);
  }, [productId]);

  // Ask a New Question
  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, userId: "U123", username: "JohnDoe", question: newQuestion }),
      });

      if (res.ok) {
        const newQ = await res.json();
        setQuestions([newQ, ...questions]);
        setNewQuestion("");
      }
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
      const res = await fetch(`/api/answer/${questionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId: "S1001", sellerName: "EcoStore", answer: answers[questionId] }),
      });

      if (res.ok) {
        const updatedQ = await res.json();
        setQuestions(questions.map((q) => (q.questionId === questionId ? updatedQ : q)));
        setAnswers({ ...answers, [questionId]: "" });
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Customer Questions & Answers</h2>

      {/* Ask a Question */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Ask a Question</h3>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="What would you like to know about this product?"
          rows="3"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button 
            onClick={handleAskQuestion} 
            disabled={isSubmitting || !newQuestion.trim()} 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isSubmitting || !newQuestion.trim() 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Question'}
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">{questions.length} Questions</h3>
        
        {questions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-2">No questions yet.</p>
            <p className="text-gray-600 font-medium">Be the first to ask about this product!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q._id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedQuestion(expandedQuestion === q._id ? null : q._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{q.question}</p>
                      <div className="text-sm text-gray-500 mt-1">
                        Asked by {q.username} on {formatDate(q.date)}
                      </div>
                    </div>
                    <div className="text-gray-400 ml-2">
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

                {expandedQuestion === q._id && (
                  <div className="p-4 bg-white">
                    {/* Display Answers */}
                    {q.answers.length > 0 ? (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Answers:</h4>
                        <ul className="space-y-3">
                          {q.answers.map((a, idx) => (
                            <li key={idx} className="bg-blue-50 p-3 rounded-md">
                              <div className="flex items-center mb-1">
                                <span className="font-medium text-blue-700">{a.sellerName}</span>
                                <span className="text-gray-400 text-xs ml-2">Seller</span>
                              </div>
                              <p className="text-gray-700">{a.answer}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic mb-4">No answers yet.</p>
                    )}

                    {/* Answer Form */}
                    <div className="border-t pt-3">
                      <h4 className="font-medium text-gray-700 mb-2">Add Answer:</h4>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-2 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Share your answer..."
                        rows="2"
                        value={answers[q.questionId] || ""}
                        onChange={(e) => setAnswers({ ...answers, [q.questionId]: e.target.value })}
                      ></textarea>
                      <button 
                        onClick={() => handleAnswer(q.questionId)} 
                        disabled={isSubmitting || !answers[q.questionId]?.trim()}
                        className={`py-1 px-3 rounded text-sm font-medium ${
                          isSubmitting || !answers[q.questionId]?.trim()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {isSubmitting ? 'Posting...' : 'Post Answer'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QnASection;