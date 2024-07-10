// import React from 'react';
// import { StyleSheet, View, Text, Button, FlatList, TextInput, Alert } from 'react-native';

// const messages = [
//   { id: '1', text: 'Hello!' },
//   { id: '2', text: 'Hi! How are you?' },
//   { id: '3', text: 'I am good, thank you!' },
// ];

// const ChatScreen = ({ route, navigation }) => {
//   const chat = route?.params?.chat;

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <Button
//           onPress={() => Alert.alert('Driver Confirmed')}
//           title="Confirm Driver"
//         />
//       ),
//     });
//   }, [navigation]);

//   if (!chat) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>No chat data available.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.messageList}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Type a message..."
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   messageList: {
//     paddingVertical: 10,
//   },
//   message: {
//     fontSize: 16,
//     padding: 10,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 10,
//     marginVertical: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 25,
//     padding: 10,
//     marginVertical: 10,
//   },
//   errorText: {
//     fontSize: 18,
//     color: 'red',
//     textAlign: 'center',
//   },
// });

// export default ChatScreen;


import React from 'react';
import { StyleSheet, View, Text, Button, FlatList, TextInput, Alert } from 'react-native';

const messages = [
  { id: '1', text: 'Hello!' },
  { id: '2', text: 'Hi! How are you?' },
  { id: '3', text: 'I am good, thank you!' },
];

const ChatScreen = ({ route, navigation }) => {
  const chat = route?.params?.chat;

  React.useLayoutEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerRight: () => (
          <Button
            onPress={() => Alert.alert('Driver Confirmed')}
            title="Confirm Driver"
          />
        ),
      });
    }
  }, [navigation]);

  if (!chat) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No chat data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageList: {
    paddingVertical: 10,
  },
  message: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 10,
    marginVertical: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default ChatScreen;
