'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';
import { handleExcitedClick, fetchExcitedCount } from '../lib/excited';
import { supabase } from '../lib/supabaseClient';
import EarlyAccessModal from './EarlyAccessModal';
import posthog from 'posthog-js';

export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  const [lifetimeLikes, setLifetimeLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  // Format excited count (K/M)
  const formatCount = (count) => {
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (count >= 1_000) return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return count.toString();
  };

  // Fetch like counts & check local like
  useEffect(() => {
    const localLiked = localStorage.getItem('excited-liked');
    if (localLiked === 'true') setLiked(true);
    loadCounts();
  }, []);

  useEffect(() => {
    const sync = (e) => {
      if (e.key === 'excited-liked' && e.newValue === 'true') setLiked(true);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const loadCounts = async () => {
    const countData = await fetchExcitedCount();
    setTodayCount(countData.today);
    setLifetimeLikes(countData.total);

    // Optional: debug India clicks
    const { data, error } = await supabase
      .from('excitement_clicks')
      .select('*')
      .eq('country', 'India');
    if (error) console.error('Country fetch error:', error.message);
    else console.log('India clicks:', data);
  };

  // ❤️ Excited button
  const handleClick = async () => {
    if (liked) return;
    await handleExcitedClick();
    await loadCounts();
    setLiked(true);
    localStorage.setItem('excited-liked', 'true');

    posthog.capture('click_excited', {
      location: 'hero_section',
      page: 'home',
      timestamp: new Date().toISOString(),
    });
  };

  // CTA Button: GET EARLY ACCESS
  const handleAccessClick = () => {
    setShowModal(true);
    posthog.capture('click_waitlist', {
      source: 'hero_section',
      location: 'main_cta',
      timestamp: new Date().toISOString(),
    });
  };

  // Top circular JOIN WAITLIST NOW button
  const handleTopButtonClick = () => {
    setShowModal(true);
    posthog.capture('click_top_circle', {
      source: 'hero_section',
      location: 'top_circular_cta',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <section className={styles.heroSectionWrapper}>
      {/* 🟣 Top Circular CTA */}
      <div className={styles.circularWrapper}>
        <button className={styles.button} onClick={handleTopButtonClick}>
          <div className={styles.button__text}>
            {'JOIN WAITLIST NOW'.split('').map((char, i) => (
              <span key={i} style={{ '--index': i }}>{char}</span>
            ))}
          </div>
          <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 🌟 Hero Content */}
      <div className={styles.hero}>
        <h1 className={styles.heading}>Generate Viral Captions in Seconds</h1>
        <p className={styles.subheading}>
          Captions & posts that grab attention — no effort, no writer’s block.
        </p>

        {/* 🚀 CTA and ❤️ Excited */}
        <div className={styles.ctaRow}>
          <button onClick={handleAccessClick} className={styles.pushable}>
            <span className={styles.shadow}></span>
            <span className={styles.edge}></span>
            <span className={styles.front}>
              <span className={styles.btnShine}>GET EARLY ACCESS</span>
            </span>
          </button>

          <div
            className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
            onClick={handleClick}
          >
            <div className={styles.like}>
              <svg className={styles.likeIcon} viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218
                         25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25
                         2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052
                         5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25
                         0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17
                         15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
              <span className={styles.likeText}>Excited</span>
            </div>

            <div className={styles.likeCountWrapper}>
              <span className={`${styles.likeCount} ${styles.one} ${liked ? styles.hide : ''}`}>
                {formatCount(todayCount)}
              </span>
              <span className={`${styles.likeCount} ${styles.two} ${liked ? styles.show : ''}`}>
                {formatCount(todayCount)}
              </span>
            </div>
          </div>
        </div>

        {/* 📸 Hero Image */}
        <div className={styles.bannerWrapper}>
          <Image
            src="/banner.svg"
            alt="Banner Illustration"
            width={1157}
            height={862}
            className={styles.banner}
          />
        </div>
      </div>

      {/* 🔓 Waitlist Modal */}
      <EarlyAccessModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}