'use client';
import React from 'react';
import styles from './TestimonialsSection.module.css';

export default function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Loved by Creators</h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <p className={styles.quote}>
            I used to struggle writing posts — now it’s done in seconds!
          </p>
          <p className={styles.author}><strong>Priya, Lifestyle Blogger</strong></p>
        </div>

        <div className={styles.card}>
          <p className={styles.quote}>
            Engagement on my reels tripled. It’s like having a social media team!
          </p>
          <p className={styles.author}><strong>Ravi, Travel Creator</strong></p>
        </div>

        <div className={styles.card}>
          <p className={styles.quote}>
            I love how quick and catchy my captions are now. Zero stress.
          </p>
          <p className={styles.author}><strong>Ananya, Small Business Owner</strong></p>
        </div>
      </div>

      <div className={styles.ctaBox}>
        <h3 className={styles.ctaHeading}>Ready to Spark Your Next Post?</h3>
        <p className={styles.ctaSubheading}>
          Turn ideas into scroll-stopping captions — in seconds.
        </p>
        <button className={styles.ctaButton}>Start Generating Now</button>
      </div>
    </section>
  );
}
