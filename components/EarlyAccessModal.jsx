'use client';
import { useState, useEffect } from 'react';
import styles from './EarlyAccessModal.module.css';
import { supabase } from '../lib/supabaseClient';
import Lottie from 'lottie-react';
import successAnimation from './lottie/success.json';

export default function EarlyAccessModal({ show, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputStarted, setInputStarted] = useState(false);

  useEffect(() => {
    if (show) {
      gtag('event', 'modal_open_waitlist', {
        event_category: 'Waitlist Modal',
        event_label: 'Modal Opened',
        value: 1,
      });
    }
  }, [show]);

  useEffect(() => {
    if (isSubmitted) {
      gtag('event', 'success_waitlist_shown', {
        event_category: 'Waitlist Modal',
        event_label: 'Success Message Shown',
        value: 1,
      });

      const timeout = setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setName('');
        setEmail('');
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [isSubmitted, onClose]);

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

      const { data, error } = await supabase
        .from('waitlist')
        .insert([{ name, email: email.toLowerCase() }]);

      if (error) throw error;

      setEmailError(false);
      setIsSubmitted(true);

      gtag('event', 'submit_waitlist', {
        event_category: 'Waitlist Modal',
        event_label: 'Form Submitted',
        value: 1,
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
      setErrorMessage('Server error. Try again later.');
    }
  };

  const handleClose = () => {
    gtag('event', 'close_waitlist_modal', {
      event_category: 'Waitlist Modal',
      event_label: 'Closed Without Submit',
      value: 1,
    });
    onClose();
  };

  const handleInput = () => {
    if (!inputStarted) {
      setInputStarted(true);
      gtag('event', 'form_input_started', {
        event_category: 'Waitlist Modal',
        event_label: 'Started Typing',
        value: 1,
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