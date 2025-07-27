'use client';

import React, { useState, useEffect } from 'react';
import { handleExcitedClick, fetchExcitedCount } from '../lib/excited';

export default function ExcitedButton() {
  const [status, setStatus] = useState('default'); // default | loading | success
  const [clicked, setClicked] = useState(false);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('excited-clicked');
    if (stored === 'true') {
      setClicked(true);
      setStatus('success');
    }

    fetchExcitedCount().then((res) => setTodayCount(res.today || 0));
  }, []);

  const handleClick = async () => {
    if (clicked || status === 'loading') return;

    setStatus('loading');
    try {
      await handleExcitedClick();

      // Wait for visual feedback, then update count
      setTimeout(async () => {
        const updated = await fetchExcitedCount();
        setTodayCount(updated.today || 0);
        setClicked(true);
        localStorage.setItem('excited-clicked', 'true');
        setStatus('success');
      }, 1200);
    } catch (e) {
      console.error('Excited button error:', e);
      setStatus('default');
    }
  };

  const getButtonText = () => {
    if (status === 'loading') return '❤️ Sending...';
    if (status === 'success') return `🔥 Thank you!`;
    return '❤️ I’m Excited';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <button
        onClick={handleClick}
        disabled={clicked || status === 'loading'}
        style={{
          background: '#1e1e1e',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          fontSize: '16px',
          color: 'white',
          border: 'none',
          cursor: clicked ? 'not-allowed' : 'pointer',
          minWidth: '180px',
        }}
      >
        <span>{getButtonText()}</span>
        <span style={{
          backgroundColor: '#333',
          borderRadius: '8px',
          padding: '2px 8px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#fff',
        }}>
          {todayCount}
        </span>
      </button>
    </div>
  );
}