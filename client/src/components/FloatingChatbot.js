import React, { useState } from 'react';
import axios from 'axios';
import './FloatingChatbot.css';

const API_BASE_URL = 'http://localhost:8080/api';

function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    if (!isOpen && messages.length === 0) {
      // Add welcome message on first open
      setMessages([{
        type: 'bot',
        text: '👋 Hello! I\'m Dr. AI, your professional virtual doctor. I\'m here to provide medical guidance and health tips. How can I assist you today? Please describe your symptoms or health concerns.',
        timestamp: new Date()
      }]);
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const patient = JSON.parse(localStorage.getItem('patient') || '{}');
      
      console.log('🤖 Sending message to chatbot:', currentMessage);
      
      const response = await axios.post(`${API_BASE_URL}/chatbot/query`, {
        message: currentMessage,
        patientId: patient.id || null,
        patientName: patient.name || 'Guest'
      }, {
        timeout: 15000 // 15 second timeout
      });

      console.log('✅ Chatbot response received:', response.data);

      const botMessage = {
        type: 'bot',
        text: response.data.reply || response.data.message, // Support both formats
        timestamp: new Date(),
        doctorName: response.data.recommendedDoctor,
        suggestedSpecialization: response.data.specialization || response.data.suggestedSpecialization
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('❌ Chatbot error:', error);
      
      // Create intelligent fallback based on user's message
      let fallbackText = "I apologize for the technical difficulty. However, I'm still here to help. ";
      
      const msg = currentMessage.toLowerCase();
      if (msg.includes('chest') || msg.includes('heart') || msg.includes('breath')) {
        fallbackText += "Based on your symptoms related to chest or breathing, I strongly recommend consulting a Cardiologist as soon as possible. ";
        fallbackText += "These symptoms can be serious. Please rest and avoid strenuous activities until you can see a doctor.";
      } else if (msg.includes('skin') || msg.includes('rash') || msg.includes('itch')) {
        fallbackText += "For your skin concerns, I recommend consulting a Dermatologist who can properly diagnose and treat the condition. ";
        fallbackText += "Meanwhile, avoid scratching and keep the area clean and moisturized.";
      } else if (msg.includes('headache') || msg.includes('dizzy') || msg.includes('migraine')) {
        fallbackText += "For persistent headaches or dizziness, I recommend consulting a Neurologist for proper evaluation. ";
        fallbackText += "In the meantime, rest in a quiet, dark room and stay well-hydrated.";
      } else if (msg.includes('fever') || msg.includes('cough') || msg.includes('cold')) {
        fallbackText += "For your symptoms, I recommend consulting a General Physician for proper assessment and treatment. ";
        fallbackText += "Please stay hydrated, get plenty of rest, and monitor your temperature.";
      } else if (msg.includes('child') || msg.includes('baby') || msg.includes('kid')) {
        fallbackText += "For your child's health concerns, I strongly recommend consulting a Pediatrician who specializes in child care. ";
        fallbackText += "They can provide age-appropriate guidance and treatment.";
      } else {
        fallbackText += "I recommend consulting a General Physician for proper medical evaluation of your symptoms. ";
        fallbackText += "They can provide personalized care based on your specific situation.";
      }
      
      fallbackText += " You can book an appointment through our platform. If this is an emergency, please call emergency services immediately.";
      
      const errorMessage = {
        type: 'bot',
        text: fallbackText,
        timestamp: new Date(),
        isError: false, // Don't show as error since we have fallback
        suggestedSpecialization: 'General Physician'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="floating-chat-button"
        title="AI Health Assistant"
      >
        {isOpen ? '✖️' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="floating-chat-window">
          
          {/* Header */}
          <div className="chat-header">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-bold">AI Health Assistant</h3>
                <p className="text-xs opacity-75">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              ✖️
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-bubble">
                  <p>{message.text}</p>
                  
                  {message.doctorName && (
                    <div className="doctor-card">
                      <p className="font-bold">👨‍⚕️ Recommended:</p>
                      <p>{message.doctorName}</p>
                      <p className="text-sm">{message.suggestedSpecialization}</p>
                    </div>
                  )}
                  
                  <span className="timestamp">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message bot">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about symptoms, medicines..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()}>
              📤
            </button>
          </form>

        </div>
      )}
    </>
  );
}

export default FloatingChatbot;
