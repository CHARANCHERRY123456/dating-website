import React, { useState, useEffect } from 'react';
import useMatchStore from '../../store/matchStore';
import Modal from '../../components/Modal';
import FeedbackModal from '../feedback/FeedbackModal';

const MatchCard = ({ match }) => {
  const { unpinMatch } = useMatchStore();
  const [showUnpinModal, setShowUnpinModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [freezeTimeLeft, setFreezeTimeLeft] = useState(null);
  const [isUnpinning, setIsUnpinning] = useState(false);

  useEffect(() => {
    if (match?.status === 'frozen' && match?.freezeUntil) {
      const updateTimer = () => {
        const now = new Date().getTime();
        const freezeEnd = new Date(match.freezeUntil).getTime();
        const timeLeft = freezeEnd - now;

        if (timeLeft > 0) {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          setFreezeTimeLeft({ hours, minutes });
        } else {
          setFreezeTimeLeft(null);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [match?.status, match?.freezeUntil]);

  const handleUnpin = async () => {
    setIsUnpinning(true);
    const result = await unpinMatch(match.id);
    setIsUnpinning(false);
    setShowUnpinModal(false);
    
    if (result.success) {
      setShowFeedbackModal(true);
    }
  };

  const getStatusBadge = () => {
    if (match.status === 'frozen') {
      return (
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Reflection Phase
        </div>
      );
    }
    
    if (match.status === 'active') {
      return (
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Active Match
        </div>
      );
    }

    return null;
  };

  const getProgressPercentage = () => {
    return Math.min((match.messageCount / 100) * 100, 100);
  };

  if (!match) {
    return (
      <div className="card p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Match</h3>
        <p className="text-gray-500">Your next meaningful connection is on its way.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden bg-white rounded-xl shadow-card transition hover:shadow-card-hover hover:-translate-y-1 transform-gpu duration-300">
        <div className="relative">
          <img
            src={match.matchedUser.avatar}
            alt={match.matchedUser.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            {getStatusBadge()}
            <div className="bg-white/90 backdrop-blur-sm text-primary-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
              </svg>
              {Math.round(match.compatibilityScore * 100)}% Match
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black bg-opacity-50 rounded-lg p-3 text-white">
              <h3 className="text-xl font-semibold">{match.matchedUser.name}, {match.matchedUser.age}</h3>
              <p className="text-sm opacity-90">{match.matchedUser.location}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4 leading-relaxed">{match.matchedUser.bio}</p>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Compatibility Highlights</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-600 text-sm font-medium mb-1">Common Interests</div>
                <div className="text-green-800 text-lg font-semibold">
                  {match.matchedUser.interests.filter(
                    interest => match.user.interests.includes(interest)
                  ).length}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-600 text-sm font-medium mb-1">Location</div>
                <div className="text-blue-800 text-lg font-semibold">
                  {Math.round(match.locationScore * 100)}% Close
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {match.matchedUser.interests.map((interest, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  match.user.interests.includes(interest)
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {interest}
              </span>
            ))}
          </div>

          {match.status === 'frozen' && freezeTimeLeft ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-blue-800">Reflection Phase</span>
              </div>
              <p className="text-blue-600 text-sm">
                Time remaining: {freezeTimeLeft.hours}h {freezeTimeLeft.minutes}m
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Conversation Progress</span>
                  <span className="text-sm text-gray-500">{match.messageCount}/100 messages</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                {match.messageCount >= 100 && (
                  <p className="text-green-600 text-sm mt-2 font-medium">
                    🎉 Video call unlocked!
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.href = '/chat'}
                  className="flex-1 bg-accent text-white font-medium py-3 rounded-lg hover:bg-accent/80 transition"
                >
                  Start Conversation
                </button>
                <button
                  onClick={() => setShowUnpinModal(true)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  title="Unpin match"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={showUnpinModal}
        onClose={() => setShowUnpinModal(false)}
        title="Unpin Match"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to unpin this match? This will start a 24-hour reflection phase, 
            and your match will receive a new connection in 2 hours.
          </p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={() => setShowUnpinModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleUnpin}
              disabled={isUnpinning}
              className="btn-primary"
            >
              {isUnpinning ? 'Unpinning...' : 'Yes, Unpin'}
            </button>
          </div>
        </div>
      </Modal>

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        matchId={match?.id}
        matchedUserId={match?.matchedUser?.id}
      />
    </>
  );
};

export default MatchCard;