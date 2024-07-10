import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const dummyChats = [
  {
    id: '1',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    name: 'Rahim Uddin',
    latestText: 'I will be there at 5 PM.',
    latestTextTime: '2:30 PM',
    tripName: 'Trip to Cox\'s Bazar',
  },
  {
    id: '2',
    profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    name: 'Kamal Hossain',
    latestText: 'Looking forward to the trip.',
    latestTextTime: '1:15 PM',
    tripName: 'Trip to Sylhet',
  },
  {
    id: '3',
    profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    name: 'Jamal Ahmed',
    latestText: 'Please confirm the details.',
    latestTextTime: '12:45 PM',
    tripName: 'Trip to Sundarbans',
  },
  {
    id: '4',
    profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    name: 'Salam Khan',
    latestText: 'See you tomorrow.',
    latestTextTime: '11:30 AM',
    tripName: 'Trip to Rangpur',
  },
  {
    id: '5',
    profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
    name: 'Hafizur Rahman',
    latestText: 'I have arrived at the location.',
    latestTextTime: '10:00 AM',
    tripName: 'Trip to Kuakata',
  },
  {
    id: '6',
    profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg',
    name: 'Shafiqul Islam',
    latestText: 'Ready for the trip.',
    latestTextTime: '9:45 AM',
    tripName: 'Trip to Jaflong',
  },
  {
    id: '7',
    profilePicture: 'https://randomuser.me/api/portraits/men/7.jpg',
    name: 'Nazmul Haque',
    latestText: 'See you soon!',
    latestTextTime: '9:00 AM',
    tripName: 'Trip to Bandarban',
  },
  {
    id: '8',
    profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg',
    name: 'Faruq Mia',
    latestText: 'Trip confirmed.',
    latestTextTime: '8:30 AM',
    tripName: 'Trip to Gazipur',
  },
  {
    id: '9',
    profilePicture: 'https://randomuser.me/api/portraits/men/9.jpg',
    name: 'Habib Ullah',
    latestText: 'Please call me.',
    latestTextTime: '8:00 AM',
    tripName: 'Trip to Feni',
  },
  {
    id: '10',
    profilePicture: 'https://randomuser.me/api/portraits/men/10.jpg',
    name: 'Alim Uddin',
    latestText: 'I am on my way.',
    latestTextTime: '7:45 AM',
    tripName: 'Trip to Dhaka',
  },
  {
    id: '11',
    profilePicture: 'https://randomuser.me/api/portraits/men/11.jpg',
    name: 'Shahin Alam',
    latestText: 'Confirmed the time.',
    latestTextTime: '7:30 AM',
    tripName: 'Trip to Rajshahi',
  },
  {
    id: '12',
    profilePicture: 'https://randomuser.me/api/portraits/men/12.jpg',
    name: 'Hasan Mahmud',
    latestText: 'See you soon.',
    latestTextTime: '7:00 AM',
    tripName: 'Trip to Barisal',
  },
];

const ChatItem = ({ chat, onPress }) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={() => onPress(chat)}>
      <Image source={{ uri: chat.profilePicture }} style={styles.profilePicture} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{chat.name}</Text>
        <Text style={styles.chatText}>{chat.latestText}</Text>
        <Text style={styles.chatTime}>{chat.latestTextTime}</Text>
        <Text style={styles.chatTrip}>{chat.tripName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function Messages() {
  const [chats, setChats] = useState(dummyChats);
  const navigation = useNavigation();

  const handleChatPress = (chat) => {
    navigation.navigate('ChatScreen', { chat });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Current Conversations</Text>
      <FlatList
        data={chats}
        renderItem={({ item }) => <ChatItem chat={item} onPress={handleChatPress} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  chatList: {
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatText: {
    fontSize: 14,
    color: '#555',
  },
  chatTime: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  chatTrip: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-start',
  },
});
