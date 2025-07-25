'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';
import EarlyAccessModal from '../components/EarlyAccessModal';
import { supabase } from '../lib/supabaseClient';
import usePageView from '../lib/usePageView';
import * as gtag from '../lib/gtag'; // 👈 GA import

export default function HeroSection() {
  usePageView();
  const [showModal, setShowModal] = useState(false);
  const [excitedCount, setExcitedCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [userIP, setUserIP] = useState('');

  const formatCount = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return count.toString();
  };

  useEffect(() => {
    const initialize = async () => {
      const localLiked = localStorage.getItem('excited-liked');
      if (localLiked === 'true') setLiked(true);

      const ip = await getUserIP();
      setUserIP(ip);
      await fetchExcitedCount();

      if (localLiked !== 'true') {
        await checkIfLiked(ip);
      }
    };
    initialize();
  }, []);

  const getUserIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch {
      return 'anonymous';
    }
  };

  const fetchExcitedCount = async () => {
    const { data, error } = await supabase
      .from('engagements')
      .select('count')
      .eq('type', 'excited')
      .single();

    if (!error && data) {
      setExcitedCount(data.count || 0);
    }
  };

  const checkIfLiked = async (ip) => {
    const { data } = await supabase
      .from('excitement_clicks')
      .select('ip_address')
      .eq('ip_address', ip);

    if (data?.length) {
      setLiked(true);
      localStorage.setItem('excited-liked', 'true');
    }
  };

  const handleExcitedClick = async () => {
    if (!userIP || liked) return;

    await supabase.from('excitement_clicks').insert([{ ip_address: userIP }]);

    const { error } = await supabase
      .from('engagements')
      .upsert(
        { type: 'excited', count: excitedCount + 1, updated_at: new Date().toISOString() },
        { onConflict: 'type' }
      );

    if (!error) {
      setLiked(true);
      setExcitedCount((prev) => prev + 1);
      localStorage.setItem('excited-liked', 'true');

      // 🔥 GA Event
      gtag.event({
        action: 'click_excited',
        category: 'Engagement',
        label: 'Excited Button',
        value: 1,
      });
    }
  };

  const handleAccessClick = () => {
    setShowModal(true);

    // 🔥 GA Event
    gtag.event({
      action: 'click_waitlist',
      category: 'CTA',
      label: 'Get Early Access',
      value: 1,
    });
  };

  const handleTopButtonClick = () => {
    setShowModal(true);

    // 🔥 GA Event
    gtag.event({
      action: 'click_top_circle',
      category: 'CTA',
      label: 'Top Circular Button',
      value: 1,
    });
  };

  return (
    <section className={styles.heroSectionWrapper}>
      {/* 🔵 Rotating Circular Button */}
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

      {/* 🔤 Hero Text */}
      <div className={styles.hero}>
        <h1 className={styles.heading}>Generate Viral Captions in Seconds</h1>
        <p className={styles.subheading}>
          Captions & posts that grab attention — no effort, no writer’s block.
        </p>

        {/* 🚀 CTA Row */}
        <div className={styles.ctaRow}>
          <button onClick={handleAccessClick} className={styles.pushable}>
            <span className={styles.shadow}></span>
            <span className={styles.edge}></span>
            <span className={styles.front}>
              <span className={styles.btnShine}>GET EARLY ACCESS</span>
            </span>
          </button>

          {/* ❤️ Excited Button */}
          <div
            className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
            onClick={handleExcitedClick}
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

            {/* 🔢 Like Count Animation */}
            <div className={styles.likeCountWrapper}>
              <span className={`${styles.likeCount} ${styles.one} ${liked ? styles.hide : ''}`}>
                {formatCount(excitedCount)}
              </span>
              <span className={`${styles.likeCount} ${styles.two} ${liked ? styles.show : ''}`}>
                {formatCount(excitedCount)}
              </span>
            </div>
          </div>
        </div>

        {/* 🖼 Banner */}
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

      {/* 📩 Modal */}
      <EarlyAccessModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}