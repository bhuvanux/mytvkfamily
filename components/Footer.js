'use client';
import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © 2025 <strong>CaptionSpark</strong> ✦ Built for creators ✦ Made with <span className={styles.heart}>❤️</span> for creators everywhere.
      </p>
    </footer>
  );
}
