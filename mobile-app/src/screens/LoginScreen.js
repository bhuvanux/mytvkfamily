import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sendOTP, verifyOTP } = useAuth();

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      await sendOTP(formattedPhone);
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(otp);
      // Navigation will be handled automatically by AuthContext
    } catch (error) {
      Alert.alert('Error', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FF6B35', '#F7931E', '#FDC830']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>🕉️ Murugan Wallpapers</Text>
          <Text style={styles.subtitle}>
            Discover beautiful devotional wallpapers and videos
          </Text>

          <View style={styles.formContainer}>
            {!otpSent ? (
              <>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={15}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>Enter OTP</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={() => setOtpSent(false)}
                >
                  <Text style={styles.resendText}>Change Phone Number</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={styles.footer}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  resendText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default LoginScreen;
