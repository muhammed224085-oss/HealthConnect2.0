import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { messageAPI } from '../services/api';

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  // Get recipient from route params or default to demo doctor
  const recipientId = route?.params?.recipientId || 'demo-doctor';
  const recipientName = route?.params?.recipientName || 'Dr. Smith';

  useEffect(() => {
    loadUserData();
    loadMessages();
    
    // Simulate receiving messages
    const interval = setInterval(() => {
      simulateIncomingMessage();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      // Set recipient info
      setRecipient({
        id: recipientId,
        name: recipientName,
        type: 'doctor'
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      // In a real app, you would load messages from the API
      // For demo purposes, we'll use some sample messages
      const sampleMessages = [
        {
          id: '1',
          senderId: recipientId,
          receiverId: 'current-user',
          message: 'Hello! How can I help you today?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true,
        },
        {
          id: '2',
          senderId: 'current-user',
          receiverId: recipientId,
          message: 'Hi doctor, I have been experiencing some symptoms.',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          isRead: true,
        },
        {
          id: '3',
          senderId: recipientId,
          receiverId: 'current-user',
          message: 'Could you please describe your symptoms in detail?',
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          isRead: true,
        },
      ];
      
      setMessages(sampleMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    const message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      receiverId: recipientId,
      message: messageText,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, message]);

    try {
      // In a real app, you would send the message to the API
      await messageAPI.send({
        receiverId: recipientId,
        message: messageText,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show the message as failed and allow retry
    }

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const simulateIncomingMessage = () => {
    const responses = [
      "Thank you for the information. Based on your symptoms, I recommend you schedule an appointment for a proper examination.",
      "Have you been taking any medications recently?",
      "Please make sure to get adequate rest and stay hydrated.",
      "I would suggest some blood tests to rule out any underlying conditions.",
      "If symptoms persist, please don't hesitate to contact me immediately.",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const message = {
      id: Date.now().toString(),
      senderId: recipientId,
      receiverId: 'current-user',
      message: randomResponse,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, message]);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageBubble = ({ message }) => {
    const isOwnMessage = message.senderId === 'current-user';
    
    return (
      <View style={[
        styles.messageBubble,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {message.message}
        </Text>
        <Text style={[
          styles.messageTime,
          isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{recipient?.name}</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.callButton}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
        
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        )}
      </ScrollView>

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: newMessage.trim() ? 1 : 0.5 }
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
  },
  headerInfo: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4caf50',
    marginTop: 2,
  },
  callButton: {
    fontSize: 20,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
  },
  ownMessage: {
    backgroundColor: '#1976d2',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#999',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#1976d2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatScreen;