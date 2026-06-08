import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subscriptionAPI } from '../api/api';
import { useAuthStore } from '../store/store';
import Layout from '../components/Layout';

const SubscriptionsPage = () => {
  const { user } = useAuthStore();
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?._id) fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      const res = await subscriptionAPI.getSubscribedChannels(user._id);
      setChannels(res.data.data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <svg className="w-7 h-7 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Subscriptions
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{channels.length} channels you follow</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="h-44 skeleton rounded-2xl" />)}
          </div>
        ) : channels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {channels.map((sub) => {
              const ch = sub.channel || sub;
              return (
                <Link to={`/channel/${ch.username}`} key={sub._id} className="glass-card-hover rounded-xl overflow-hidden text-center" id={`sub-${sub._id}`}>
                  <div className="h-20 bg-gradient-to-r from-accent-700/20 to-dark-800" />
                  <div className="-mt-8 relative z-10 px-4 pb-4">
                    <img src={ch.avatar} alt={ch.username} className="w-14 h-14 rounded-xl object-cover mx-auto border-3 border-dark-800 ring-2 ring-white/10" />
                    <h3 className="font-semibold text-sm mt-3 truncate" style={{ color: 'var(--text-primary)' }}>{ch.fullname || ch.username}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{ch.username}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You haven't subscribed to any channels yet</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubscriptionsPage;
