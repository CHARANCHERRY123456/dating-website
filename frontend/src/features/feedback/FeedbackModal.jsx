import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import api from '../../configs/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const FeedbackModal = ({ isOpen, onClose, matchId, matchedUserId }) => {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && matchId && matchedUserId) {
      generateFeedback();
    }
  }, [isOpen, matchId, matchedUserId]);

  const generateFeedback = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/feedback/generate', {
        matchId,
        matchedUserId
      });
      setFeedback(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFeedback(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Match Reflection"
      size="lg"
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-4">Generating personalized insights...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : feedback ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🔍 Reflection Insights
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Every connection teaches us something valuable about ourselves and what we're looking for. 
                Here's some thoughtful feedback to help you grow.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-2">
                    1
                  </span>
                  Possible Reason
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {feedback.feedback.reason}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-2">
                    2
                  </span>
                  Growth Suggestion
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {feedback.feedback.suggestion}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-2">
                    3
                  </span>
                  Personal Insight
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {feedback.feedback.insight}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div>
                  <h5 className="font-medium text-yellow-800 mb-1">Reflection Period</h5>
                  <p className="text-yellow-700 text-sm">
                    You're now in a 24-hour mindful reflection phase. Use this time to process these insights 
                    and prepare for your next meaningful connection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="btn-primary"
          >
            Continue Journey
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;