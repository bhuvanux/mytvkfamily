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

  useEffect(() => {
    if (isSubmitted) {
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
    // 👇 Check if email already exists (skip name check)
    const { data: existingUser, error: fetchError } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', email.toLowerCase());

    if (fetchError) {
      throw fetchError;
    }

    if (existingUser.length > 0) {
      setErrorMessage('This email is already on the waitlist.');
      setEmailError(true);
      return;
    }

    // 👇 Insert user
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ name, email: email.toLowerCase() }]);

    if (error) {
      throw error;
    }

    setEmailError(false);
    setIsSubmitted(true);
    console.log('User added to waitlist:', data);

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
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </form>
      )}
    </div>
  );
}