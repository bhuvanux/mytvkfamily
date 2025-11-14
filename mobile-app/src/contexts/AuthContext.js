import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithPhoneNumber, 
  PhoneAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../../firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      setLoading(false);
    });

    // Check for stored user on mount
    checkStoredUser();

    return unsubscribe;
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (phoneNumber) => {
    try {
      // Note: For React Native, you'll need to use Firebase Phone Auth with reCAPTCHA
      // This is a simplified version. In production, you'll need to implement proper verification
      
      // For Expo, you might want to use a different approach or Firebase Admin SDK on backend
      console.log('Sending OTP to:', phoneNumber);
      
      // Placeholder for actual implementation
      // const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      // setVerificationId(confirmation.verificationId);
      
      // For demo purposes, we'll simulate OTP sending
      setVerificationId('demo-verification-id');
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const verifyOTP = async (otp) => {
    try {
      if (!verificationId) {
        throw new Error('No verification ID found');
      }

      // In production, verify the OTP with Firebase
      // const credential = PhoneAuthProvider.credential(verificationId, otp);
      // const userCredential = await signInWithCredential(auth, credential);
      
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6) {
        // Create a demo user
        const demoUser = {
          uid: 'demo-user-' + Date.now(),
          phoneNumber: '+1234567890',
          displayName: 'Demo User'
        };
        setUser(demoUser);
        await AsyncStorage.setItem('user', JSON.stringify(demoUser));
        return { success: true, user: demoUser };
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // await firebaseSignOut(auth);
      setUser(null);
      setVerificationId(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    sendOTP,
    verifyOTP,
    signOut,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
