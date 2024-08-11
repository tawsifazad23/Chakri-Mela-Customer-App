// import React from 'react';
// import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';

// const ChatItem = ({ chat, onPress }) => {
//   const handleLongPress = () => {
//     Alert.alert(
//       "Options",
//       `Do you want to accept or reject the request from ${chat.name}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Accept", onPress: () => console.log(`Accepted request from ${chat.name}`) },
//         { text: "Reject", onPress: () => console.log(`Rejected request from ${chat.name}`) },
//       ]
//     );
//   };

//   return (
//     <TouchableOpacity onPress={onPress} onLongPress={handleLongPress} style={styles.container}>
//       <Image source={{ uri: chat.profilePicture }} style={styles.profilePicture} />
//       <View style={styles.textContainer}>
//         <Text style={styles.name}>{chat.name}</Text>
//         <Text style={styles.latestText}>{chat.latestText}</Text>
//       </View>
//       <Text style={styles.latestTextTime}>{chat.latestTextTime}</Text>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   profilePicture: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   textContainer: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   latestText: {
//     color: '#888',
//   },
//   latestTextTime: {
//     color: '#888',
//   },
// });

// export default ChatItem;

import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';

const ChatItem = ({ chat, onPress }) => {
  const handleLongPress = () => {
    Alert.alert(
      "Options",
      `Do you want to accept or reject the request from ${chat.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Accept", onPress: () => console.log(`Accepted request from ${chat.name}`) },
        { text: "Reject", onPress: () => console.log(`Rejected request from ${chat.name}`) },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={onPress} onLongPress={handleLongPress} style={styles.container}>
      <Image source={{ uri: chat.profilePicture }} style={styles.profilePicture} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{chat.name}</Text>
        <Text style={styles.latestText}>{chat.latestText}</Text>
      </View>
      <Text style={styles.latestTextTime}>{chat.latestTextTime}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  latestText: {
    color: '#888',
  },
  latestTextTime: {
    color: '#888',
  },
});

export default ChatItem;
