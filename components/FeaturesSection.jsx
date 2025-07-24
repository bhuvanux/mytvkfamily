'use client';
import React from 'react';
import styles from './FeaturesSection.module.css';
import Image from 'next/image';
import FeatureImage from '/public/feature_Illu.svg'; // Make sure you have this SVG

export default function FeaturesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <h2 className={styles.heading}>Feature Highlights</h2>

          <ul className={styles.featureList}>
            <li>
              <h3>Platform Ready</h3>
              <p>Captions tailored for Instagram, Facebook, Twitter & more</p>
            </li>
            <li>
              <h3>Tone Control</h3>
              <p>Pick your vibe: Funny, Formal, Friendly, or Trendy.</p>
            </li>
            <li>
              <h3>Post in Seconds</h3>
              <p>Just type your idea & get 3 polished versions</p>
            </li>
            <li>
              <h3>#Hashtags & CTA</h3>
              <p>Hashtags, emojis & calls-to-action — auto-done.</p>
            </li>
            <li>
              <h3>Best Time to Post</h3>
              <p>AI even suggests when to post for max reach.</p>
            </li>
          </ul>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={FeatureImage}
            alt="Feature Illustration"
            className={styles.image}
            priority
          />
        </div>
      </div>
    </section>
  );
}
