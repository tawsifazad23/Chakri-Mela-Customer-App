// import React, { useState, useRef } from 'react';
// import {
//   View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity,
//   SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const FormInput = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, error, onFocus, showPasswordRequirements, children }) => (
//   <View style={styles.inputContainer}>
//     <Text style={styles.label}>{label}</Text>
//     <TextInput
//       style={[styles.input, error && styles.inputError]}
//       placeholder={placeholder}
//       value={value}
//       onChangeText={onChangeText}
//       secureTextEntry={secureTextEntry}
//       keyboardType={keyboardType}
//       onFocus={onFocus}
//     />
//     {showPasswordRequirements && children}
//     {error && <Text style={styles.errorText}>{error}</Text>}
//   </View>
// );

// export default function SignupScreen() {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [confirmEmail, setConfirmEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
//   const [phone, setPhone] = useState('+880');
//   const [address, setAddress] = useState('');
//   const [nid, setNid] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [occupation, setOccupation] = useState('');
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const scrollViewRef = useRef(null);
//   const router = useRouter();

//   const toTitleCase = (str) => {
//     return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!firstName) newErrors.firstName = 'First Name is required';
//     if (!lastName) newErrors.lastName = 'Last Name is required';
//     if (!email) newErrors.email = 'Email is required';
//     if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
//     if (email !== confirmEmail) newErrors.confirmEmail = 'Emails do not match';
//     if (!password) newErrors.password = 'Password is required';
//     if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
//     if (!phone) newErrors.phone = 'Phone number is required';
//     if (!/^\+8801[3-9]\d{8}$/.test(phone)) newErrors.phone = 'Phone number must be a valid Bangladeshi number';
//     if (!address) newErrors.address = 'Address is required';
//     if (!nid) newErrors.nid = 'NID is required';
//     if (!/^\d{10}$/.test(nid)) newErrors.nid = 'NID must be 10 digits';
//     if (!dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSignup = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     const data = {
//       first_name: toTitleCase(firstName),
//       last_name: toTitleCase(lastName),
//       email: email,
//       confirm_email: confirmEmail,
//       password: password,
//       confirm_password: confirmPassword,
//       phone: phone,
//       address: address,
//       nid: nid,
//       date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,
//       occupation: occupation,
//     };

//     try {
//       setLoading(true);
//       const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/signup/customer`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const responseData = await response.json();
//       setLoading(false);

//       if (response.ok) {
//         await AsyncStorage.setItem('authToken', responseData.token);
//         Alert.alert('Signup Successful', responseData.message || 'Signup has been successful. Please log in with your credentials.');
//         router.replace('/');
//       } else {
//         Alert.alert('Signup Failed', responseData.error || 'Please try again.');
//       }
//     } catch (error) {
//       setLoading(false);
//       Alert.alert('Signup Failed', 'An error occurred. Please try again.');
//     }
//   };

//   const toggleShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const getPasswordStrength = (password) => {
//     if (!password) return 'Weak';
//     const lengthRequirement = password.length >= 6;
//     const uppercaseRequirement = /[A-Z]/.test(password);
//     const lowercaseRequirement = /[a-z]/.test(password);
//     const numberRequirement = /\d/.test(password);
//     const specialCharRequirement = /[!@#$%^&*]/.test(password);

//     const strength = lengthRequirement + uppercaseRequirement + lowercaseRequirement + numberRequirement + specialCharRequirement;

//     if (strength === 5) return 'Strong';
//     if (strength >= 3) return 'Medium';
//     return 'Weak';
//   };

//   const getPasswordStrengthColor = (strength) => {
//     switch (strength) {
//       case 'Strong':
//         return 'green';
//       case 'Medium':
//         return 'orange';
//       case 'Weak':
//       default:
//         return 'red';
//     }
//   };

//   const handleInputFocus = (ref) => {
//     ref.current?.scrollTo({ y: 0, animated: true });
//   };

//   const renderPasswordRequirements = () => (
//     <View style={styles.passwordRequirements}>
//       <Text style={styles.requirementText}>Password must contain:</Text>
//       <Text style={styles.requirementText}>• At least 6 characters</Text>
//       <Text style={styles.requirementText}>• An uppercase letter (A-Z)</Text>
//       <Text style={styles.requirementText}>• A lowercase letter (a-z)</Text>
//       <Text style={styles.requirementText}>• A number (0-9)</Text>
//       <Text style={styles.requirementText}>• A special character (!@#$%^&*)</Text>
//     </View>
//   );

//   const handleDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || dateOfBirth;
//     setShowDatePicker(false);
//     setDateOfBirth(currentDate);
//     scrollViewRef.current?.scrollTo({ y: 0, animated: true });
//   };

//   const isFormValid = () => {
//     return (
//       firstName &&
//       lastName &&
//       email &&
//       confirmEmail &&
//       password &&
//       confirmPassword &&
//       phone &&
//       address &&
//       nid &&
//       dateOfBirth &&
//       !Object.keys(errors).length
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
//             <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//               <Text style={styles.backButtonText}>Back</Text>
//             </TouchableOpacity>
//             <View style={styles.container}>
//               <Text style={styles.title}>CHAKRIMELA</Text>
//               <Text style={styles.subtitle}>Turn Your Spare Time into Extra Cash</Text>
//               <FormInput
//                 label="First Name"
//                 placeholder="First Name"
//                 value={firstName}
//                 onChangeText={setFirstName}
//                 error={errors.firstName}
//                 onFocus={() => handleInputFocus(scrollViewRef)}
//               />
//               <FormInput
//                 label="Last Name"
//                 placeholder="Last Name"
//                 value={lastName}
//                 onChangeText={setLastName}
//                 error={errors.lastName}
//                 onFocus={() => handleInputFocus(scrollViewRef)}
//               />
//               <FormInput
//                 label="Email"
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 error={errors.email}
//                 onFocus={() => handleInputFocus(scrollViewRef)}
//               />
//               <FormInput
//                 label="Confirm Email"
//                 placeholder="Confirm Email"
//                 value={confirmEmail}
//                 onChangeText={setConfirmEmail}
//                 keyboardType="email-address"
//                 error={errors.confirmEmail}
//                 onFocus={() => handleInputFocus(scrollViewRef)}
//               />
//               <View style={styles.passwordContainer}>
//                 <FormInput
//                   label="Set Password (6 or more characters)"
//                   placeholder="Set Strong Password"
//                   value={password}
//                   onChangeText={setPassword}
//                   secureTextEntry={!showPassword}
//                   error={errors.password}
//                   onFocus={() => { setShowPasswordRequirements(true); handleInputFocus(scrollViewRef); }}
//                   onBlur={() => setShowPasswordRequirements(false)}
//                   showPasswordRequirements={showPasswordRequirements}
//                 >
//                   {renderPasswordRequirements()}
//                 </FormInput>
//                 <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordButton}>
//                   <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
//                 </TouchableOpacity>
//               </View>
//               <Text style={[styles.passwordStrength, { color: getPasswordStrengthColor(getPasswordStrength(password)) }]}>
//                 Password Strength: {getPasswordStrength(password)}
//               </Text>
//               <FormInput
//                 label="Confirm Password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//                 secureTextEntry={!showPassword}
//                 error={errors.confirmPassword}
//                 onFocus={() => handleInputFocus(scrollViewRef)}
//               />
//               <FormInput
//                 label="Phone"
//                 placeholder="+880 1700550078"
//                 value={phone}
//                 onChangeText={setPhone}
//                 keyboardType="phone-pad"
//                 error={errors.phone}
//                 onFocus={() => handleInputFocus(scrollViewRef)}
//               />
//               <FormInput
//                 label="Address"
//                 placeholder="e.g. 1234 Main St"
//                 value={address}
//                 onChangeText={setAddress}
//                 error={errors.address}
//                 onFocus={() => handleInputFocus(scrollViewRef)}
//               />
//               <FormInput
//                 label="National Identification Number"
//                 placeholder="e.g. 1234567890"
//                 value={nid}
//                 onChangeText={setNid}
//                 keyboardType="number-pad"
//                 error={errors.nid}
//                 onFocus={() => handleInputFocus(scrollViewRef)}
//               />
//               <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
//                 <Text style={styles.datePickerText}>Date of Birth: {dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : 'Select Date'}</Text>
//               </TouchableOpacity>
//               {showDatePicker && (
//                 <DateTimePicker
//                   value={dateOfBirth || new Date()}
//                   mode="date"
//                   display="spinner"
//                   onChange={handleDateChange}
//                 />
//               )}
//               <FormInput
//                 label="Occupation"
//                 placeholder="Occupation"
//                 value={occupation}
//                 onChangeText={setOccupation}
//                 onFocus={() => handleInputFocus(scrollViewRef)}
//               />
//               <Text style={styles.disclaimerText}>
//                 By clicking below and signing up, I agree to CHAKRIMELA's terms of service and privacy policy.
//               </Text>
//               <TouchableOpacity
//                 style={[
//                   styles.signupButton,
//                   isFormValid() ? styles.signupButtonActive : styles.signupButtonInactive
//                 ]}
//                 onPress={handleSignup}
//                 disabled={!isFormValid()}
//               >
//                 <Text style={[
//                   styles.signupButtonText,
//                   isFormValid() ? styles.signupButtonTextActive : styles.signupButtonTextInactive
//                 ]}>
//                   Signup
//                 </Text>
//               </TouchableOpacity>
//               {loading && <ActivityIndicator size="large" color="#000" />}
//             </View>
//           </ScrollView>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//   },
//   container: {
//     width: '80%',
//     marginTop: 35,
//     marginLeft: 25,
//     marginRight: 35,
//     borderRadius: 25,
//     paddingLeft: 30,
//     paddingRight: 30,
//     backgroundColor: '#f8f9fa',
//     alignItems: 'center',
//   },
//   backButton: {
//     alignSelf: 'flex-start',
//     marginLeft: 15,
//     marginRight: 5,
//   },
//   backButtonText: {
//     fontSize: 20,
//     color: '#000',
//   },
//   title: {
//     fontSize: 35,
//     marginTop: 20,
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: 13,
//     marginBottom: 35,
//     color: '#000',
//   },
//   inputContainer: {
//     width: '90%',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 8,
//     fontWeight: 'bold',
//   },
//   input: {
//     width: '100%',
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     backgroundColor: '#fff',
//     fontSize: 16,
//   },
//   inputError: {
//     borderColor: 'red',
//   },
//   errorText: {
//     alignSelf: 'flex-start',
//     marginTop: 4,
//     color: 'red',
//     fontSize: 14,
//   },
//   datePicker: {
//     width: '90%',
//     padding: 12,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     backgroundColor: '#fff',
//   },
//   datePickerText: {
//     color: '#333',
//     fontSize: 16,
//   },
//   passwordContainer: {
//     width: '100%',
//     marginLeft: 18,
//     position: 'relative',
//   },
//   showPasswordButton: {
//     position: 'absolute',
//     right: 20,
//     top: 20,
//   },
//   showPasswordText: {
//     fontSize: 16,
//     color: '#007bff',
//   },
//   passwordStrength: {
//     alignSelf: 'flex-start',
//     color: '#333',
//     marginBottom: 15,
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   signupButton: {
//     width: '60%',
//     padding: 12,
//     marginBottom: 20,
//     borderColor: '#000',
//     borderWidth: 1,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   signupButtonActive: {
//     backgroundColor: '#000',
//   },
//   signupButtonInactive: {
//     backgroundColor: '#fff',
//   },
//   signupButtonText: {
//     fontSize: 20,
//   },
//   signupButtonTextActive: {
//     color: '#fff',
//   },
//   signupButtonTextInactive: {
//     color: '#000',
//   },
//   passwordRequirements: {
//     marginTop: 8,
//   },
//   requirementText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   disclaimerText: {
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 10,
//     width: '90%',
//   },
// });
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormInput = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, error, onFocus, showPasswordRequirements, children }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      onFocus={onFocus}
    />
    {showPasswordRequirements && children}
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [phone, setPhone] = useState('+880');
  const [address, setAddress] = useState('');
  const [nid, setNid] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [occupation, setOccupation] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef(null);
  const router = useRouter();

  const toTitleCase = (str) => {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  };

  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First Name is required';
    if (!lastName) newErrors.lastName = 'Last Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (email !== confirmEmail) newErrors.confirmEmail = 'Emails do not match';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!phone) newErrors.phone = 'Phone number is required';
    if (!/^\+8801[3-9]\d{8}$/.test(phone)) newErrors.phone = 'Phone number must be a valid Bangladeshi number';
    if (!address) newErrors.address = 'Address is required';
    if (!nid) newErrors.nid = 'NID is required';
    if (!/^\d{10}$/.test(nid)) newErrors.nid = 'NID must be 10 digits';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    const data = {
      first_name: toTitleCase(firstName),
      last_name: toTitleCase(lastName),
      email: email,
      confirm_email: confirmEmail,
      password: password,
      confirm_password: confirmPassword,
      phone: phone,
      address: address,
      nid: nid,
      date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,
      occupation: occupation,
    };

    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/signup/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      setLoading(false);

      if (response.ok) {
        await AsyncStorage.setItem('authToken', responseData.token);
        Alert.alert('Signup Successful', responseData.message || 'Signup has been successful. Please log in with your credentials.');
        router.replace('/');
      } else {
        Alert.alert('Signup Failed', responseData.error || responseData.message || 'Please try again.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Signup Failed', 'An error occurred. Please try again.');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrength = (password) => {
    if (!password) return 'Weak';
    const lengthRequirement = password.length >= 6;
    const uppercaseRequirement = /[A-Z]/.test(password);
    const lowercaseRequirement = /[a-z]/.test(password);
    const numberRequirement = /\d/.test(password);
    const specialCharRequirement = /[!@#$%^&*]/.test(password);

    const strength = lengthRequirement + uppercaseRequirement + lowercaseRequirement + numberRequirement + specialCharRequirement;

    if (strength === 5) return 'Strong';
    if (strength >= 3) return 'Medium';
    return 'Weak';
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 'Strong':
        return 'green';
      case 'Medium':
        return 'orange';
      case 'Weak':
      default:
        return 'red';
    }
  };

  const handleInputFocus = (ref) => {
    ref.current?.scrollTo({ y: 0, animated: true });
  };

  const renderPasswordRequirements = () => (
    <View style={styles.passwordRequirements}>
      <Text style={styles.requirementText}>Password must contain:</Text>
      <Text style={styles.requirementText}>• At least 6 characters</Text>
      <Text style={styles.requirementText}>• An uppercase letter (A-Z)</Text>
      <Text style={styles.requirementText}>• A lowercase letter (a-z)</Text>
      <Text style={styles.requirementText}>• A number (0-9)</Text>
      <Text style={styles.requirementText}>• A special character (!@#$%^&*)</Text>
    </View>
  );

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const isFormValid = () => {
    return (
      firstName &&
      lastName &&
      email &&
      confirmEmail &&
      password &&
      confirmPassword &&
      phone &&
      address &&
      nid &&
      dateOfBirth &&
      !Object.keys(errors).length
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.container}>
              <Text style={styles.title}>CHAKRIMELA</Text>
              <Text style={styles.subtitle}>Turn Your Spare Time into Extra Cash</Text>
              <FormInput
                label="First Name"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                error={errors.firstName}
                onFocus={() => handleInputFocus(scrollViewRef)}
              />
              <FormInput
                label="Last Name"
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                error={errors.lastName}
                onFocus={() => handleInputFocus(scrollViewRef)}
              />
              <FormInput
                label="Email"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                error={errors.email}
                onFocus={() => handleInputFocus(scrollViewRef)}
              />
              <FormInput
                label="Confirm Email"
                placeholder="Confirm Email"
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                keyboardType="email-address"
                error={errors.confirmEmail}
                onFocus={() => handleInputFocus(scrollViewRef)}
              />
              <View style={styles.passwordContainer}>
                <FormInput
                  label="Set Password (6 or more characters)"
                  placeholder="Set Strong Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  error={errors.password}
                  onFocus={() => { setShowPasswordRequirements(true); handleInputFocus(scrollViewRef); }}
                  onBlur={() => setShowPasswordRequirements(false)}
                  showPasswordRequirements={showPasswordRequirements}
                >
                  {renderPasswordRequirements()}
                </FormInput>
                <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordButton}>
                  <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.passwordStrength, { color: getPasswordStrengthColor(getPasswordStrength(password)) }]}>
                Password Strength: {getPasswordStrength(password)}
              </Text>
              <FormInput
                label="Confirm Password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                error={errors.confirmPassword}
                onFocus={() => handleInputFocus(scrollViewRef)}
              />
              <FormInput
                label="Phone"
                placeholder="+880 1700550078"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                error={errors.phone}
                onFocus={() => handleInputFocus(scrollViewRef)}
              />
              <FormInput
                label="Address"
                placeholder="e.g. 1234 Main St"
                value={address}
                onChangeText={setAddress}
                error={errors.address}
                onFocus={() => handleInputFocus(scrollViewRef)}
              />
              <FormInput
                label="National Identification Number"
                placeholder="e.g. 1234567890"
                value={nid}
                onChangeText={setNid}
                keyboardType="number-pad"
                error={errors.nid}
                onFocus={() => handleInputFocus(scrollViewRef)}
              />
              <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.datePickerText}>Date of Birth: {dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : 'Select Date'}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                />
              )}
              <FormInput
                label="Occupation"
                placeholder="Occupation"
                value={occupation}
                onChangeText={setOccupation}
                onFocus={() => handleInputFocus(scrollViewRef)}
              />
              <Text style={styles.disclaimerText}>
                By clicking below and signing up, I agree to CHAKRIMELA's terms of service and privacy policy.
              </Text>
              <TouchableOpacity
                style={[
                  styles.signupButton,
                  isFormValid() ? styles.signupButtonActive : styles.signupButtonInactive
                ]}
                onPress={handleSignup}
                disabled={!isFormValid()}
              >
                <Text style={[
                  styles.signupButtonText,
                  isFormValid() ? styles.signupButtonTextActive : styles.signupButtonTextInactive
                ]}>
                  Signup
                </Text>
              </TouchableOpacity>
              {loading && <ActivityIndicator size="large" color="#000" />}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  container: {
    width: '80%',
    marginTop: 35,
    marginLeft: 25,
    marginRight: 35,
    borderRadius: 25,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginRight: 5,
  },
  backButtonText: {
    fontSize: 20,
    color: '#000',
  },
  title: {
    fontSize: 35,
    marginTop: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 35,
    color: '#000',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    alignSelf: 'flex-start',
    marginTop: 4,
    color: 'red',
    fontSize: 14,
  },
  datePicker: {
    width: '90%',
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  datePickerText: {
    color: '#333',
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    marginLeft: 18,
    position: 'relative',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  showPasswordText: {
    fontSize: 16,
    color: '#007bff',
  },
  passwordStrength: {
    alignSelf: 'flex-start',
    color: '#333',
    marginBottom: 15,
    marginLeft: 10,
    fontSize: 16,
  },
  signupButton: {
    width: '60%',
    padding: 12,
    marginBottom: 20,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  signupButtonActive: {
    backgroundColor: '#000',
  },
  signupButtonInactive: {
    backgroundColor: '#fff',
  },
  signupButtonText: {
    fontSize: 20,
  },
  signupButtonTextActive: {
    color: '#fff',
  },
  signupButtonTextInactive: {
    color: '#000',
  },
  passwordRequirements: {
    marginTop: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#333',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    width: '90%',
  },
});
