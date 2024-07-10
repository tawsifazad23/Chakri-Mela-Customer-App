import React, {useState} from 'react';
import {Text, StyleSheet, View, TextInput, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const App = () => {
  const [currency, setCurrency] = useState('US Dollar');
  return (
    <View >
      <Text > Demo Form </Text>
      <View>
        <TextInput 
          placeholder="Email" />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
        />
        <Picker
          selectedValue={currency}
          onValueChange={currentCurrency => setCurrency(currentCurrency)}>
          <Picker.Item label="USD" value="US Dollars" />
          <Picker.Item label="EUR" value="Euro" />
          <Picker.Item label="NGN" value="Naira" />
        </Picker>
        <Text>
          Selected: {currency}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  //Check project repo for styles
});

export default App;