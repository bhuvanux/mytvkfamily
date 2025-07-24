'use client';
import React, { useState } from 'react';
import styles from './HeroSection.module.css';
import EarlyAccessModal from '../components/EarlyAccessModal'; // if HeroSection is inside /components and EarlyAccessModal is a sibling file

export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className={styles.heroSectionWrapper}>
      {/* 🟣 Circular Button Top Right */}
      <div className={styles.circularWrapper}>
        <button
          className={styles.button}
          onClick={() => setShowModal(true)}
        >
          <p className={styles.button__text}>
            {[
              'J', 'O', 'I', 'N', '', 'W', 'A', 'I', 'T', 'L', 'I', 'S', 'T', '', 'N', 'O', 'W'
            ].map((char, index) => (
              <span key={index} style={{ '--index': index }}>{char}</span>
            ))}
          </p>

          <div className={styles.button__circle}>
            <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.button__icon} width="14">
              <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
            </svg>
            <svg viewBox="0 0 14 15" fill="none" width="14" xmlns="http://www.w3.org/2000/svg" className={`${styles.button__icon} ${styles.button__iconCopy}`}>
              <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
            </svg>
          </div>
        </button>
      </div>

      {/* ✨ Hero Content */}
      <div className={styles.hero}>
        <h1 className={styles.heading}>
          Generate Viral Captions in Seconds
        </h1>

        <p className={styles.subheading}>
          Captions & posts that grab attention — no effort, no writer’s block.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className={styles.pushable}
        >
          <span className={styles.shadow}></span>
          <span className={styles.edge}></span>
          <span className={styles.front}>
            <span className={styles.btnShine}>Get Early Access</span>
          </span>
        </button>

        <div className={styles.bannerWrapper}>
          <img
            src="/banner.svg"
            alt="Banner Illustration"
            className={styles.banner}
          />
        </div>
      </div>

      {/* 🌟 Early Access Modal */}
      <EarlyAccessModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}