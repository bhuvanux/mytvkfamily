'use client';

import { useState } from 'react';
import styles from './HistoryTab.module.css';

// Utility to format "Today", "Yesterday", or full date
const formatDate = (timestamp) => {
  const created = new Date(timestamp);
  const now = new Date();

  const isToday = created.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = created.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return created.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const HistoryTab = ({ allCaptions = [], onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleMenu, setVisibleMenu] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCaptions = allCaptions.filter((c) =>
    c.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.search}
        placeholder="Search your history..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {filteredCaptions.length === 0 ? (
        <p className={styles.empty}>No history found.</p>
      ) : (
        <ul className={styles.timeline}>
          {filteredCaptions.map((caption) => (
            <li key={caption.id} className={styles.timelineItem}>
              <div className={styles.captionBlock}>
                <div className={styles.captionText}>{caption.text}</div>
                <div className={styles.captionHashtags}>{caption.hashtags}</div>
                <div className={styles.captionTime}>
                  {caption.created_at &&
                    `${formatDate(caption.created_at)}, ${new Date(caption.created_at).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`}
                </div>

                <div
                  className={styles.menuWrapper}
                  onClick={() =>
                    setVisibleMenu(visibleMenu === caption.id ? null : caption.id)
                  }
                >
                  <img
                    src="/icons/MoreIcon.svg"
                    alt="Options"
                    width={18}
                    height={18}
                    className={styles.dotsIcon}
                  />
                  {visibleMenu === caption.id && (
                    <div className={styles.dropdownMenu}>
                      <button onClick={() => alert('Edit feature coming soon')}>
                        Edit
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(caption.text)}
                      >
                        Share
                      </button>
                      <button onClick={() => onDelete(caption.id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryTab;