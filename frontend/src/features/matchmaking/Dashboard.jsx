import React, { useEffect } from 'react';
import useMatchStore from '../../store/matchStore';
import useAuthStore from '../../store/authStore';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import MatchCard from './MatchCard';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { activeMatch, matches, fetchActiveMatch, fetchMatches, isLoading, error } = useMatchStore();

  useEffect(() => {
    fetchActiveMatch();
    fetchMatches();
  }, [fetchActiveMatch, fetchMatches]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <LoadingSpinner size="lg" className="py-20" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* List all chats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Conversations</h2>
          <ul className="space-y-2">
            {matches.map(match => (
              <li key={match.id}>
                <a
                  href="/chat"
                  onClick={() => window.location.assign('/chat')}
                  className="block p-4 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  {match.matchedUser.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">
            Your mindful journey to meaningful connections continues
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Current Match</h2>
              <MatchCard match={activeMatch} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mindful Moments</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 italic">
                    "The best relationships begin with a genuine connection to yourself."
                  </p>
                </div>
                <div className="bg-gradient-to-r from-secondary-50 to-primary-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 italic">
                    "Quality over quantity - one meaningful conversation can change everything."
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How LoneTown Works</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
                  <p>You get one carefully selected match at a time</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
                  <p>Engage in meaningful conversations</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
                  <p>After 100 messages in 48 hours, unlock video calls</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">4</span>
                  <p>Unpin when ready for a 24-hour reflection period</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;