'use client';

import { useState, useEffect } from 'react';
import styles from './EarlyAccessModal.module.css';
import { supabase } from '../lib/supabaseClient';
import Lottie from 'lottie-react';
import successAnimation from './lottie/success.json';
import posthog from 'posthog-js';

export default function EarlyAccessModal({ show, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputStarted, setInputStarted] = useState(false);
  const [metadata, setMetadata] = useState({});

  // Fetch user metadata (device, platform, browser, country)
  useEffect(() => {
    const fetchMetadata = async () => {
      const device = navigator.userAgent;
      const platform = navigator.platform;

      const browser = (() => {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
      })();

      let country = 'Unknown';
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        country = data.country_name || 'Unknown';
      } catch (err) {
        console.warn('Country fetch failed:', err);
      }

      setMetadata({
        device,
        platform,
        browser,
        country,
        timestamp: new Date().toISOString(),
      });
    };

    fetchMetadata();
  }, []);

  // PostHog: Track modal open
  useEffect(() => {
    if (show) {
      posthog.capture('modal_open_waitlist', metadata);
    }
  }, [show, metadata]);

  // PostHog: Track success shown and auto-close
  useEffect(() => {
    if (isSubmitted) {
      posthog.capture('success_waitlist_shown', metadata);

      const timeout = setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setName('');
        setEmail('');
        setInputStarted(false);
        setErrorMessage('');
        setEmailError(false);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [isSubmitted, metadata, onClose]);

  // Input tracking
  const handleInput = () => {
    if (!inputStarted) {
      setInputStarted(true);
      posthog.capture('form_input_started', metadata);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setEmailError(false);

    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('waitlist')
        .select('*')
        .eq('email', email.toLowerCase());

      if (fetchError) throw fetchError;

      if (existingUser.length > 0) {
        setErrorMessage('This email is already on the waitlist.');
        setEmailError(true);
        return;
      }

      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([
          {
            name,
            email: email.toLowerCase(),
            country: metadata.country || 'Unknown',
          },
        ]);

      if (insertError) throw insertError;

      setIsSubmitted(true);

      posthog.capture('submit_waitlist', {
        name,
        email,
        ...metadata,
      });

      await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
    } catch (err) {
      console.error('Error:', err.message);
      setErrorMessage('There was an error or the email already exists.');
    }
  };

  const handleClose = () => {
    posthog.capture('close_waitlist_modal', metadata);
    onClose();
  };

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      {isSubmitted ? (
        <div className={styles.successContainer}>
          <div className={styles.lottieAnimation}>
            <Lottie animationData={successAnimation} loop={false} />
          </div>
          <p className={styles.successMessage}>மிக்க மகிழ்ச்சி!☺️🙏</p>
          <p className={styles.successMessage}>மாநாட்டில் சந்திப்போம் ,வெற்றி வாகை சூடுவோம் ❤️</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.p1}>இரண்டாவது மாநில மாநாடு தளபதி அழைக்கிறார்!</p>

          <div className={styles.flexColumn}><label>Name</label></div>
          <div className={styles.inputForm}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleInput();
              }}
              required
            />
          </div>

          <div className={styles.flexColumn}><label>Email</label></div>
          <div className={`${styles.inputForm} ${emailError ? styles.inputFormError : ''}`}>
            <input
              type="email"
              className={styles.input}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInput();
              }}
              required
            />
          </div>

          <button className={styles.button} type="submit">
            <span className={styles.shadow}></span>
            <span className={styles.edge}></span>
            <div className={styles.front}><span>மாநாட்டில் சந்திப்போம்</span></div>
          </button>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <p className={styles.p}>நாடே எதிர்பாக்கும் மக்கள் விரும்பும் முதலமைச்சர் வேட்பாளர் விஜய்</p>

          <button className={styles.closeBtn} onClick={handleClose}>×</button>
        </form>
      )}
    </div>
  );
}