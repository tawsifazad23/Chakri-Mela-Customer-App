import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView,
  ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


const FormInput = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, error }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const LoginScreen = () => {
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password1233');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/login/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Alert.alert('Login Successful', 'Welcome!');
        await AsyncStorage.setItem('authToken', data.token);
        router.push('/(tabs)/HomeScreen');
      } else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  const handleSignupNavigate = () => {
    router.push('/signup');
  };

  const isFormValid = () => {
    return email && password && !Object.keys(errors).length;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
          <Ionicons name="briefcase-outline" size={80} color="black" style={styles.icon} />
            <Text style={styles.title}>Kormo Mela</Text>
            <Text style={styles.subtitle1}>Customer</Text>
            <Text style={styles.subtitle}> Welcome Back ! Please Login to Continue</Text>
            <FormInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
            />
            <FormInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />
            <TouchableOpacity
              style={[styles.loginButton, isFormValid() ? styles.loginButtonActive : styles.loginButtonInactive]}
              onPress={handleLogin}
              disabled={!isFormValid()}
            >
              <Text style={[
                styles.loginButtonText,
                isFormValid() ? styles.loginButtonTextActive : styles.loginButtonTextInactive
              ]}>
                Login
              </Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#000" />}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={handleSignupNavigate}>
                <Text style={styles.signupLink}> Sign up here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: '100%',
    height: '18%',
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    marginBottom: 10,
    color: '#000',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 35,
    color: '#555',
    textAlign: 'center',
  },
  subtitle1: {
    fontSize: 24,
    marginBottom: 35,
    color: '#555',
    textAlign: 'center',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    alignSelf: 'flex-start',
    marginTop: 4,
    color: 'red',
  },
  loginButton: {
    width: '40%',
    padding: 10,
    marginBottom: 20,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonActive: {
    backgroundColor: '#000',
  },
  loginButtonInactive: {
    backgroundColor: '#fff',
  },
  loginButtonText: {
    fontSize: 16,
  },
  loginButtonTextActive: {
    color: '#fff',
  },
  loginButtonTextInactive: {
    color: '#000',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    fontSize: 12,
    color: '#333',
  },
  signupLink: {
    fontSize: 12,
    color: '#000',
  },
});

export default LoginScreen;
