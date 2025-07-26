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

  // Step 1: Capture browser, platform, country
  useEffect(() => {
    const fetchDetails = async () => {
      const device = navigator.userAgent;
      const platform = navigator.platform;
      const browser = (() => {
        const ua = navigator.userAgent;
        if (ua.includes("Chrome")) return "Chrome";
        if (ua.includes("Safari")) return "Safari";
        if (ua.includes("Firefox")) return "Firefox";
        if (ua.includes("Edge")) return "Edge";
        return "Other";
      })();
      let country = 'Unknown';
      try {
        const res = await fetch('https://ipapi.co/json');
        const data = await res.json();
        country = data.country_name || 'Unknown';
      } catch (err) {
        console.warn("Failed to fetch country:", err);
      }

      setMetadata({
        device,
        platform,
        browser,
        country,
        timestamp: new Date().toISOString(),
      });
    };

    fetchDetails();
  }, []);

  // Step 2: Fire modal open
  useEffect(() => {
    if (show) {
      posthog.capture('modal_open_waitlist', {
        ...metadata,
      });
    }
  }, [show, metadata]);

  // Step 3: Fire on success shown
  useEffect(() => {
    if (isSubmitted) {
      posthog.capture('success_waitlist_shown', {
        ...metadata,
      });

      const timeout = setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setName('');
        setEmail('');
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [isSubmitted, metadata, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

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

      const { error } = await supabase
        .from('waitlist')
        .insert([{ name, email: email.toLowerCase() }]);

      if (error) throw error;

      setEmailError(false);
      setIsSubmitted(true);

      posthog.capture('submit_waitlist', {
        name,
        email,
        ...metadata,
      });

      await fetch('/api/notify-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
    } catch (err) {
      console.error('Supabase error:', err.message);
      setErrorMessage('Email ID already exists or there was an error.');
    }
  };

  const handleClose = () => {
    posthog.capture('close_waitlist_modal', {
      ...metadata,
    });
    onClose();
  };

  const handleInput = () => {
    if (!inputStarted) {
      setInputStarted(true);
      posthog.capture('form_input_started', {
        ...metadata,
      });
    }
  };

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      {isSubmitted ? (
        <div className={styles.successContainer}>
          <div className={styles.lottieAnimation}>
            <Lottie animationData={successAnimation} loop={false} />
          </div>
          <p className={styles.successMessage}>Thank you!</p>
          <p className={styles.successMessage}>You're on the waitlist! 🎉</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.p1}>Claim Your Spot Before We Launch 🚀</p>

          <div className={styles.flexColumn}><label>Name</label></div>
          <div className={styles.inputForm}>
            <input
              placeholder="Enter your name"
              className={styles.input}
              type="text"
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
              placeholder="Enter your email"
              className={styles.input}
              type="email"
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
            <div className={styles.front}><span>Get Early Access</span></div>
          </button>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <p className={styles.p}>You’ll be first to know when we launch!</p>
          <button className={styles.closeBtn} onClick={handleClose}>×</button>
        </form>
      )}
    </div>
  );
}