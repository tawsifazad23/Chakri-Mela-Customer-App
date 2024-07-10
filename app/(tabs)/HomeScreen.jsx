import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, Image, StyleSheet, Switch, Modal, SafeAreaView, Button } from 'react-native';
import CalendarPicker from "react-native-calendar-picker";
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Picker from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';

const thanas = [
  { label: 'Adabar Thana', value: 'Adabar Thana' },
  { label: 'Badda Thana', value: 'Badda Thana' },
  { label: 'Bangsal Thana', value: 'Bangsal Thana' },
  { label: 'Wari Thana', value: 'Wari Thana' },
];

const lightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  buttonInactiveBackground: '#808080', // Grey for inactive button
  buttonActiveBackground: '#000000',
  buttonText: '#ffffff',
  inputBorderColor: '#000000',
  errorBorderColor: '#FF0000',
};

const darkTheme = {
  backgroundColor: '#000000',
  textColor: '#ffffff',
  buttonInactiveBackground: '#808080', // Grey for inactive button
  buttonActiveBackground: '#ffffff',
  buttonText: '#000000',
  inputBorderColor: '#ffffff',
  errorBorderColor: '#FF0000',
};

export default function HomeScreen() {
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

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    setSelectedStartDate(new Date());
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
    onChangeText(text);
    setIsDescriptionValid(text.length >= 100);
    if (text.length >= 100) {
      setErrors((prevErrors) => ({ ...prevErrors, description: false }));
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

  const handleSubmit = () => {
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
      setShowSummary(true);
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
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={100}
      >
        <ParallaxScrollView
          headerBackgroundColor={theme.backgroundColor}
          headerImage={
            <Image
              source={{ uri: 'https://rahahome.com/wp-content/uploads/2022/11/2-min-scaled.jpg' }}
              style={{ resizeMode: 'contain', width: 450, height: 300 }}
            />
          }>
          <ThemedView style={[styles.titleContainer, { backgroundColor: theme.backgroundColor }]}>
            <ThemedText type="title" style={{ color: theme.textColor }}>Hi Annur!</ThemedText>
            <HelloWave />
          </ThemedView>
          <ThemedView style={[styles.stepContainer, { backgroundColor: theme.backgroundColor }]}>
            <ThemedText type="subtitle" style={{ color: theme.textColor }}>1. Choose your service type</ThemedText>
            <View style={styles.serviceToggleContainer}>
              <Text style={{ color: theme.textColor }}>Driver</Text>
              <Switch
                value={serviceType === 'Maid'}
                onValueChange={toggleServiceType}
              />
              <Text style={{ color: theme.textColor }}>Maid</Text>
            </View>
          </ThemedView>
          <ThemedView style={[styles.stepContainer, { backgroundColor: theme.backgroundColor }]}>
            <ThemedText type="subtitle" style={{ color: theme.textColor }}>2. Date and Duration</ThemedText>
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
            />
            {selectedStartDate && selectedEndDate && (
              <ThemedText style={{ color: theme.textColor }}>
                Selected Dates: {selectedStartDate.toString()} - {selectedEndDate.toString()}
              </ThemedText>
            )}
          </ThemedView>
          <ThemedView style={[styles.stepContainer, { backgroundColor: theme.backgroundColor }]}>
            <ThemedText type="subtitle" style={{ color: theme.textColor }}>3. Set Rate (Minimum 800 Taka)</ThemedText>
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
          </ThemedView>
          <ThemedView style={[styles.stepContainer, { backgroundColor: theme.backgroundColor }]}>
            <ThemedText type="subtitle" style={{ color: theme.textColor }}>4. Onboarding Location</ThemedText>
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
          </ThemedView>
          <ThemedView style={[styles.stepContainer, { backgroundColor: theme.backgroundColor }]}>
            <ThemedText type="subtitle" style={{ color: theme.textColor }}>5. Trip Description <ThemedText type="subtitle" style={[styles.min, { color: theme.textColor }]}> (100 Characters Min)</ThemedText></ThemedText>
            <View style={{ backgroundColor: theme.backgroundColor, borderBottomColor: errors.description ? theme.errorBorderColor : theme.inputBorderColor, borderBottomWidth: 1 }}>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                onChangeText={handleDescriptionChange}
                value={description}
                style={{ padding: 10, color: theme.textColor }}
              />
              <Text style={[styles.counter, { color: theme.textColor }]}>{description.length} characters</Text>
            </View>
          </ThemedView>
          <ThemedView style={[styles.submitButtonContainer, { backgroundColor: theme.backgroundColor }]}>
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
          </ThemedView>
          <Modal visible={showSummary} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
                <ThemedText type="title" style={{ color: theme.textColor }}>Summary</ThemedText>
                <ThemedText style={{ color: theme.textColor }}>Service Type: {serviceType}</ThemedText>
                <ThemedText style={{ color: theme.textColor }}>Rate: {rate} Taka</ThemedText>
                <ThemedText style={{ color: theme.textColor }}>Location: {selectedThana}</ThemedText>
                <ThemedText style={{ color: theme.textColor }}>Dates: {selectedStartDate?.toString()} - {selectedEndDate?.toString()}</ThemedText>
                <ThemedText style={{ color: theme.textColor }}>Description: {description}</ThemedText>
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
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
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
  counter: {
    textAlign: 'right',
    marginRight: 10,
  },
  submitButtonContainer: {
    width: 200,
    borderRadius: 20,
    alignSelf: 'center',
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60, // Make the height equal to the button height
  },
  submitButton: {
    height: 60, // Set a consistent height for the button
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: 200,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  serviceToggleContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
    alignSelf: 'center',
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
});

