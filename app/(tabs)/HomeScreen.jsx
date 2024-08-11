import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, Image, StyleSheet, Modal, SafeAreaView, Button, Alert } from 'react-native';
import CalendarPicker from "react-native-calendar-picker";
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Picker from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install and link the vector icons library


const thanas = [
  { label: 'Adabar Thana', value: 'Adabar Thana' },
  { label: 'Badda Thana', value: 'Badda Thana' },
  { label: 'Bangsal Thana', value: 'Bangsal Thana' },
  { label: 'Wari Thana', value: 'Wari Thana' },
];

const lightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  buttonInactiveBackground: '#FFFFFF',
  buttonActiveBackground: '#000000',
  buttonText: '#ffffff',
  inputBorderColor: '#000000',
  errorBorderColor: '#FF0000',
};

const darkTheme = {
  backgroundColor: '#000000',
  textColor: '#ffffff',
  buttonActiveBackground: '#000000',
  buttonText: '#000000',
  inputBorderColor: '#ffffff',
  errorBorderColor: '#FF0000',
};

export default function HomeScreen({ navigation }) {
  const [description, onChangeText] = useState('');
  const [selectedThana, setSelectedThana] = useState('');
  const [rate, setRate] = useState('');
  const [isRateValid, setIsRateValid] = useState(false);
  const [isDescriptionValid, setIsDescriptionValid] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [serviceType, setServiceType] = useState('Driver');
  const [showSummary, setShowSummary] = useState(false);
  const [errors, setErrors] = useState({});
  const [profilePhoto, setProfilePhoto] = useState('');
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const driverImage = require('/Users/tawsifibneazad/firstapp/firstreactapp/assets/images/IMG_7509.jpg');
  const maidImage = require('/Users/tawsifibneazad/firstapp/firstreactapp/assets/images/IMG_7508.jpg');

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found, please log in again.');
        navigation.replace('/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/profile/customer`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProfilePhoto(data.user.profile_photo);
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch profile data.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while fetching profile data.');
      }
    };

    fetchProfileData();
  }, []);

  const handleRateChange = (input) => {
    const rateValue = parseInt(input, 10);
    if (isNaN(rateValue)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Input',
        text2: 'Please input numbers only.',
        position: 'top',
        visibilityTime: 4000,
      });
      setErrors((prevErrors) => ({ ...prevErrors, rate: true }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, rate: false }));
    }
    setRate(input);
    setIsRateValid(!isNaN(rateValue) && rateValue >= 800);
  };

  const handleDescriptionChange = (text) => {
    if (text.length <= 300) {
      onChangeText(text);
      setIsDescriptionValid(text.length >= 100);
      if (text.length >= 100) {
        setErrors((prevErrors) => ({ ...prevErrors, description: false }));
      }
    }
  };

  const handleDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

  const toggleServiceType = () => {
    setServiceType((prevType) => (prevType === 'Driver' ? 'Maid' : 'Driver'));
  };

    // Function to determine the greeting based on the current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  const handleSubmit = async () => {
    let missingFields = [];
    let newErrors = {};

    if (!isRateValid) {
      missingFields.push("Rate (Minimum 800 Taka)");
      newErrors.rate = true;
      Toast.show({
        type: 'error',
        text1: 'Invalid Rate',
        text2: 'Rate should be a number and at least 800 Taka.',
        position: 'top',
        visibilityTime: 4000,
      });
    }
    if (!isDescriptionValid) {
      missingFields.push("Trip Description (100 Characters Min)");
      newErrors.description = true;
      Toast.show({
        type: 'error',
        text1: 'Invalid Description',
        text2: 'Description should be at least 100 characters.',
        position: 'top',
        visibilityTime: 4000,
      });
    }
    if (!selectedThana) {
      missingFields.push("Onboarding Location");
      newErrors.thana = true;
      Toast.show({
        type: 'error',
        text1: 'Invalid Location',
        text2: 'Please select an onboarding location.',
        position: 'top',
        visibilityTime: 4000,
      });
    }
    if (!selectedStartDate || !selectedEndDate) {
      missingFields.push("Date and Duration");
      newErrors.date = true;
      Toast.show({
        type: 'error',
        text1: 'Invalid Dates',
        text2: 'Please select a valid date range.',
        position: 'top',
        visibilityTime: 4000,
      });
    }

    setErrors(newErrors);

    if (missingFields.length === 0) {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found, please log in again.');
        navigation.replace('/login');
        return;
      }

      const jobPostingData = {
        service_type: serviceType,
        start_date: selectedStartDate.toISOString().split('T')[0],
        end_date: selectedEndDate.toISOString().split('T')[0],
        service_rate: rate,
        onboarding_location: selectedThana,
        job_summary: description,
      };

      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/job_posting`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jobPostingData),
        });

        if (response.ok) {
          const data = await response.json();
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Request submitted successfully!',
            position: 'top',
            visibilityTime: 4000,
          });
          onChangeText('');
          setSelectedThana('');
          setRate('');
          setIsRateValid(false);
          setIsDescriptionValid(false);
          setSelectedStartDate(new Date());
          setSelectedEndDate(null);
          setServiceType('Driver');
          setErrors({});
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.message || 'Failed to submit request.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
    }
  };

  const handleConfirm = () => {
    setShowSummary(false);
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Request submitted successfully!',
      position: 'top',
      visibilityTime: 4000,
    });
    onChangeText('');
    setSelectedThana('');
    setRate('');
    setIsRateValid(false);
    setIsDescriptionValid(false);
    setSelectedStartDate(new Date());
    setSelectedEndDate(null);
    setServiceType('Driver');
    setErrors({});
  };

  const isFormValid = isRateValid && isDescriptionValid && selectedThana && selectedStartDate && selectedEndDate;
  const buttonBackgroundColor = isFormValid ? theme.buttonActiveBackground : theme.buttonInactiveBackground;
  const buttonTextColor = isFormValid ? theme.buttonText : theme.textColor;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={styles.topBar}>
        <Image
          source={require('/Users/tawsifibneazad/firstapp/firstreactapp/assets/images/IMG_6986.jpg')}
          style={styles.logo}
        />
        <Text style={{ color: theme.textColor, flex: 2, textAlign: 'center', fontSize: 17, top: 8, fontFamily: 'Merriweather-BlackItalic' }}>{getGreeting()} !</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { profile: 'dummy data' })}>
          <Image
            source={{ uri: profilePhoto || 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg' }}
            style={styles.profileLogo}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={100}
      >
        <ParallaxScrollView
          headerBackgroundColor={theme.backgroundColor}
          headerImage={
            <View style={{ position: 'relative', width: '100%', height: 300 }}>
              <Image
                source={serviceType === 'Driver' ? driverImage : maidImage}
                style={{ resizeMode: 'cover', width: '100%', height: '100%' }}
              />
              <View style={styles.serviceToggleContainer}>
                <Text style={styles.toggleText}>
                  <Text style={{ fontWeight: "bold" }}> Current search: {serviceType}</Text>{"\n"} Switch to {serviceType === 'Driver' ? 'maid' : 'driver'}?
                </Text>
                <TouchableOpacity onPress={toggleServiceType}>
                  <Image
                    source={{
                      uri: serviceType === 'Driver'
                        ? 'https://static.vecteezy.com/system/resources/previews/018/865/514/non_2x/car-driver-simple-flat-icon-illustration-vector.jpg'
                        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHZ_c-1uYMKYdj3DEIHOpgtaZORFGQtzMKsg&s'
                    }}
                    style={serviceType === 'Driver' ? styles.driverIcon : styles.maidIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.overlay} />
            </View>
          }
        >

          <View style={[styles.stepContainer, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.stepHeader}>
              <Text style={{ color: theme.textColor }}>1. Select Service Period</Text>
              <TouchableOpacity
                style={styles.jobPostingsButton}
                onPress={() => navigation.navigate('JobPostings')}
              >
                <Text style={{ color: theme.textColor }}>Your Job Postings</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.calendarContainer}>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                minDate={new Date()}
                onDateChange={handleDateChange}
                selectedStartDate={selectedStartDate}
                selectedEndDate={selectedEndDate}
                textStyle={{ color: theme.textColor }}
                todayBackgroundColor={theme.backgroundColor}
                selectedDayColor="black"
                selectedDayTextColor="white"
                previousTitle="<"
                nextTitle=">"
                previousTitleStyle={{ color: theme.textColor }}
                nextTitleStyle={{ color: theme.textColor }}
                width={340}
              />
            </View>
            {selectedStartDate && selectedEndDate && (
              <Text style={{ color: theme.textColor }}>
                Selected Dates: {selectedStartDate.toDateString()} - {selectedEndDate.toDateString()}
              </Text>
            )}
          </View>

          <View style={[styles.stepContainer, { backgroundColor: theme.backgroundColor }]}>
            <Text style={{ color: theme.textColor }}>2. Specify Service Rate <Text style={[styles.min, { color: theme.textColor }]}> (Min 800 Taka)</Text></Text>
            <TextInput
              style={[
                styles.rateInput,
                { color: theme.textColor, borderColor: errors.rate ? theme.errorBorderColor : theme.inputBorderColor },
              ]}
              keyboardType="numeric"
              placeholder="Enter rate in Taka"
              placeholderTextColor={theme.textColor}
              value={rate}
              onChangeText={handleRateChange}
            />
          </View>
          <View style={[styles.stepContainer, { backgroundColor: theme.backgroundColor }]}>
            <Text style={{ color: theme.textColor }}>3. Choose Starting Location</Text>
            <Picker
              onValueChange={(value) => setSelectedThana(value)}
              items={thanas}
              placeholder={{ label: 'Select a thana', value: null }}
              value={selectedThana}
              style={{
                inputIOS: {
                  color: theme.textColor,
                  paddingTop: 13,
                  paddingHorizontal: 10,
                  paddingBottom: 12,
                  borderWidth: 1,
                  borderColor: errors.thana ? theme.errorBorderColor : theme.inputBorderColor,
                  borderRadius: 4,
                  backgroundColor: theme.backgroundColor,
                  height: 44,
                  fontSize: 16,
                },
                inputAndroid: {
                  color: theme.textColor,
                },
              }}
            />
          </View>

          <View style={[styles.stepContainer, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.titleWithCounter}>
              <Text style={{ color: theme.textColor }}>Provide Task Summary</Text>
              <Text style={[styles.counter, { color: description.length < 100 ? 'red' : 'green' }]}>
                {description.length}
              </Text>
              <Text style={styles.counter}>/100 min</Text>
            </View>
            <View style={{ backgroundColor: theme.backgroundColor, borderBottomColor: errors.description ? theme.errorBorderColor : theme.inputBorderColor, borderBottomWidth: 1 }}>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                onChangeText={handleDescriptionChange}
                value={description}
                style={{ padding: 10, color: theme.textColor, fontSize: 19 }}
              />
            </View>
          </View>

          <View style={[styles.submitButtonContainer, { backgroundColor: theme.backgroundColor }]}>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                {
                  backgroundColor: buttonBackgroundColor,
                  borderColor: theme.textColor,
                }
              ]}
            >
              <Text style={{ color: buttonTextColor }}>Submit Request</Text>
            </TouchableOpacity>
          </View>
          <Modal visible={showSummary} transparent={true} animationType="slide">
            <View style={styles.blurBackground} />
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
                <Text style={{ color: theme.textColor, fontWeight: 'bold', marginBottom: 10 }}>Summary</Text>
                <Text style={{ color: theme.textColor, marginBottom: 5 }}>
                  <Text style={styles.boldText}>Service Type: </Text>{serviceType}
                </Text>
                <Text style={{ color: theme.textColor, marginBottom: 5 }}>
                  <Text style={styles.boldText}>Rate: </Text>{rate} Taka
                </Text>
                <Text style={{ color: theme.textColor, marginBottom: 5 }}>
                  <Text style={styles.boldText}>Location: </Text>{selectedThana}
                </Text>
                <Text style={{ color: theme.textColor, marginBottom: 5 }}>
                  <Text style={styles.boldText}>Dates: </Text>{selectedStartDate?.toLocaleDateString()} - {selectedEndDate?.toLocaleDateString()}
                </Text>
                <Text style={{ color: theme.textColor, marginBottom: 5 }}>
                  <Text style={styles.boldText}>Description: </Text>{description}
                </Text>
                <View style={styles.buttonContainer}>
                  <Button title="Confirm" onPress={handleConfirm} />
                  <Button title="Cancel" onPress={() => setShowSummary(false)} />
                </View>
              </View>
            </View>
          </Modal>
        </ParallaxScrollView>
      </KeyboardAwareScrollView>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobPostingsButton: {
    padding: 10,
    marginLeft: 20,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  jobPostingsButtonText: {
    color: 'black',
    fontWeight: 'bolder',
  },
  calendarContainer: {
    paddingHorizontal: 16,
    left: 3,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  min: {
    fontSize: 10,
  },
  rateInput: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  titleWithCounter: {
    flexDirection: 'row',
    justifyContent: 'left',
  },
  counter: {
    marginTop: 10,
    marginLeft: 3,
    fontSize: 12,
  },
  submitButtonContainer: {
    width: 170,
    borderRadius: 20,
    alignSelf: 'center',
    padding: 1,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  submitButton: {
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 25,
    width: 170,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  serviceToggleContainer: {
    position: 'absolute',
    top: 190,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: 'auto',
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
  },
  toggleText: {
    fontSize: 12,
    marginRight: 8,
    textAlign: 'center',
  },
  driverIcon: {
    width: 36,
    height: 36,
    bottom: 4,
    left: 2,
    borderRadius: 18,
  },
  maidIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'transparent',
    height: 60,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 30,
  },
  profileLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 1,
  },
  boldText: {
    fontWeight: 'bold',
    color: 'inherit',
  },
  summaryItem: {
    marginBottom: 10,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
