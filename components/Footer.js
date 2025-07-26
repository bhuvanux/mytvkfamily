'use client';
import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © 2025&nbsp;<strong>CaptionSpark</strong>&nbsp;✦&nbsp;
        Built for creators&nbsp;✦&nbsp;
        Made with <span className={styles.heart}>❤️</span>&nbsp;
        for creators everywhere.
      </p>
    </footer>
  );
}