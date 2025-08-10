'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  fetchUserDistrict,     // auto-detect (or swap for your own picker)
  getExcitedCount,       // read lifetime count per district
  incrementExcited,      // atomic RPC increment
  subscribeExcited,      // realtime subscription (UPDATE/INSERT)
} from '../lib/excited';
import EarlyAccessModal from './EarlyAccessModal';
import posthog from 'posthog-js';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(0);         // ⬅️ lifetime, not “today”
  const [liked, setLiked] = useState(false);
  const [district, setDistrict] = useState('Unknown');

  const unsubRef = useRef(null);
  const likeKey = (dist) => `excited-liked:lifetime:${dist || 'Unknown'}`;

  const formatCount = (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return (n ?? 0).toString();
  };

  // Load district → initial count → subscribe realtime
  useEffect(() => {
    let mounted = true;

    (async () => {
      const dist = await fetchUserDistrict();
      if (!mounted) return;
      setDistrict(dist);

      // restore one-click-per-browser (remove this to allow unlimited taps)
      if (localStorage.getItem(likeKey(dist)) === 'true') setLiked(true);

      // initial lifetime count
      try {
        const c = await getExcitedCount(dist);
        if (mounted) setCount(c);
      } catch (e) {
        console.warn('getExcitedCount failed:', e?.message ?? e);
      }

      // realtime subscription
      if (unsubRef.current) unsubRef.current();
      unsubRef.current = subscribeExcited(dist, (next) => {
        // guard against out-of-order events
        setCount((prev) => Math.max(prev, Number(next) || 0));
      });
    })();

    return () => {
      mounted = false;
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = async () => {
    if (liked) return;            // one per browser/profile (remove to allow multiple)
    setLiked(true);
    setCount((c) => c + 1);       // optimistic bump

    try {
      const serverCount = await incrementExcited(district);
      setCount((c) => Math.max(c, Number(serverCount) || 0));
      localStorage.setItem(likeKey(district), 'true');
    } catch (e) {
      // rollback if RPC failed
      setLiked(false);
      setCount((c) => Math.max(0, c - 1));
      console.error('increment failed:', e?.message ?? e);
    }

    posthog.capture('click_excited', {
      location: 'hero_section',
      page: 'home',
      district,
      timestamp: new Date().toISOString(),
    });
  };

  const handleAccessClick = () => {
    setShowModal(true);
    posthog.capture('click_waitlist', {
      source: 'hero_section',
      location: 'main_cta',
      district,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <section className={styles.heroSectionWrapper}>
      {/* Content + buttons */}
      <div className={styles.hero}>
        <div className={styles.contentBlock}>
          <h1 className={styles.title}>இரண்டாவது மாநில மாநாடு</h1>
          <p className={styles.subtitle}>மக்கள் விரும்பும் முதலமைச்சர் வேட்பாளர் விஜய் அழைக்கிறார்</p>
        </div>

        {/* CTAs */}
        <div className={styles.ctaRow}>
          <button
            onClick={handleAccessClick}
            className={styles.pushable}
            aria-label="மாநாட்டிற்கு செல்கிறேன்"
          >
            <span className={styles.shadow} />
            <span className={styles.edge} />
            <span className={styles.front}>
              <span className={styles.btnShine}>மாநாட்டிற்கு செல்கிறேன்</span>
            </span>
          </button>

          <div
            className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
            onClick={handleLike}
            role="button"
            aria-pressed={liked}
            aria-label="My TVK like"
          >
            <div className={styles.like}>
              <svg className={styles.likeIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0Z" />
              </svg>
              <span className={styles.likeText}>My TVK</span>
            </div>

            {/* lifetime number */}
            <div className={styles.likeCountWrapper}>
              <span className={`${styles.likeCount} ${styles.one} ${liked ? styles.hide : ''}`}>
                {formatCount(count)}
              </span>
              <span className={`${styles.likeCount} ${styles.two} ${liked ? styles.show : ''}`}>
                {formatCount(count)}
              </span>
            </div>
          </div>
        </div>

        {/* Venue info */}
        <div className={styles.venueInfo}>
          <a
            href="https://maps.app.goo.gl/DGeEEhEUHoTY8SB96"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.venueLink}
          >
            பாரப்பத்தி, மதுரை (மதுரை - தூத்துக்குடி தேசிய நெடுஞ்சாலையில்)
          </a>
          <span className={styles.separator} aria-hidden="true">•</span>
          <span className={styles.date}>21.08.2025</span>
          <span className={styles.separator} aria-hidden="true">•</span>
          <span className={styles.time}>காலை 9:00 முதல்</span>
        </div>

        {/* X / Twitter Follow */}
        <div className={styles.twitterFollow}>
          <a
            href="https://x.com/risingoftvk"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.twitterBtn}
            aria-label="Follow @risingoftvk on X"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                 viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2H21l-6.56 7.49L22.5 22h-6.937l-4.53-5.39L5.79 22H3l7.016-8.002L1.5 2h7.062l4.08 4.89L18.244 2Zm-1.212 18.31h1.86L7.03 3.61H5.062l11.97 16.7Z"/>
            </svg>
            <span>Follow</span>
          </a>
        </div>
      </div>

      <EarlyAccessModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}