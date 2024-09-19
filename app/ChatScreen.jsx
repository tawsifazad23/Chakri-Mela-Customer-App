import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventSource from 'react-native-event-source';
import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { conversation } = route.params;
  const driverName = `${conversation.service_provider_request.service_provider.first_name} ${conversation.service_provider_request.service_provider.last_name}`;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'No token found');
          return;
        }

        const eventSource = new EventSource(`${process.env.EXPO_PUBLIC_API_URL}/api/user/get-messages-customer/${conversation.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        eventSource.addEventListener('message', function (event) {
          const data = JSON.parse(event.data);
          setMessages(data);
        });

        eventSource.addEventListener('error', function (error) {
          console.error('EventSource error:', error);
          eventSource.close();
        });

        return () => {
          eventSource.close();
        };
      } catch (error) {
        console.error('Fetch messages error:', error);
        Alert.alert('Error', 'Failed to fetch messages');
      }
    };

    fetchMessages();
  }, [conversation.id]);

  useEffect(() => {
    if (flatListRef.current && !userScrolledUp) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // const sendMessage = async () => {
  //   if (message.trim()) {
  //     try {
  //       const token = await AsyncStorage.getItem('authToken');
  //       if (!token) {
  //         Alert.alert('Error', 'No token found');
  //         return;
  //       }

  //       const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/user/send-message-customer/`, {
  //         chat_id: conversation.id,
  //         message: message,
  //       }, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         }
  //       });

  //       if (response.status === 200) {
  //         setMessage('');
  //       } else {
  //         Alert.alert('Error', 'Failed to send message');
  //       }
  //     } catch (error) {
  //       console.error('Send message error:', error);
  //       Alert.alert('Error', 'Failed to send message');
  //     }
  //   }
  // };
  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'No token found');
          return;
        }
  
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/user/send-message-customer/`, {
          chat_id: conversation.id,
          message: message,
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token here
          }
        });
  
        if (response.status === 200) {
          setMessage('');
        } else {
          Alert.alert('Error', 'Failed to send message');
        }
      } catch (error) {
        console.error('Send message error:', error);
        Alert.alert('Error', 'Failed to send message');
      }
    }
  };
  


  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY < contentHeight - layoutHeight - 50) { // adjust threshold as needed
      setUserScrolledUp(true);
    } else {
      setUserScrolledUp(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.driverName}>{driverName}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('TripInfo', { conversation })}
          style={styles.infoButton}
        >
          <Ionicons name="information-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageItem,
              item.isUserMessage ? styles.userMessage : styles.driverMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.messageTime}>{new Date(item.time).toLocaleString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        onScroll={handleScroll}
        onContentSizeChange={() => {
          if (!userScrolledUp) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#f1f1f1',
      },
      backButton: {
        padding: 10,
      },
      driverName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
      },
      infoButton: {
        padding: 10,
      },
      messagesList: {
        flexGrow: 1,
        padding: 10,
      },
      messageItem: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        maxWidth: '70%',
      },
      driverMessage: {
        backgroundColor: '#e1ffc7',
        alignSelf: 'flex-start',
      },
      userMessage: {
        backgroundColor: '#cce5ff',
        alignSelf: 'flex-end',
      },
      messageText: {
        fontSize: 16,
      },
      messageTime: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
      },
      inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#f1f1f1',
      },
      input: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      sendButton: {
        marginLeft: 10,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
      },
      sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
});

export default ChatScreen;




