// components/EmptyState.jsx
import React from 'react';

const EmptyState = () => {
  return (
    <div style={{ width: '100%', textAlign: 'center', padding: '4rem 2rem', fontSize: '1rem', color: '#888' }}>
      👋 Type a topic and click <strong>Generate</strong> to see some captions!
    </div>
  );
};

export default EmptyState;
