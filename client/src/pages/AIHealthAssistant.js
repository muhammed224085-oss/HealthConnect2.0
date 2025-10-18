import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = 'http://localhost:8080/api';

function AIHealthAssistant() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get logged-in patient info
    const patientData = localStorage.getItem('patient');
    if (patientData) {
      setPatient(JSON.parse(patientData));
    }

    // Welcome message
    setMessages([{
      type: 'bot',
      text: '👋 Hello! I\'m your AI Health Assistant. I can help you with:\n• Symptom analysis and doctor suggestions\n• Disease information\n• Medicine queries\n• General health questions\n\nWhat would you like to know?',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      console.log('🤖 Sending message to chatbot:', currentMessage);
      
      const response = await axios.post(`${API_BASE_URL}/chatbot/query`, {
        message: currentMessage,
        patientId: patient?.id || null,
        patientName: patient?.name || 'Guest'
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
      let fallbackText = "I'm currently experiencing technical difficulties. However, based on your query, ";
      let suggestedSpec = 'General Physician';
      
      const msg = currentMessage.toLowerCase();
      if (msg.includes('chest') || msg.includes('heart') || msg.includes('breath')) {
        fallbackText += "I recommend consulting a Cardiologist for heart-related symptoms. These symptoms should be evaluated promptly.";
        suggestedSpec = 'Cardiologist';
      } else if (msg.includes('skin') || msg.includes('rash') || msg.includes('itch') || msg.includes('acne')) {
        fallbackText += "I recommend consulting a Dermatologist for skin concerns. Skin conditions can often be effectively treated.";
        suggestedSpec = 'Dermatologist';
      } else if (msg.includes('headache') || msg.includes('dizzy') || msg.includes('migraine') || msg.includes('vertigo')) {
        fallbackText += "I recommend consulting a Neurologist for neurological symptoms. Proper evaluation is important.";
        suggestedSpec = 'Neurologist';
      } else if (msg.includes('child') || msg.includes('baby') || msg.includes('infant') || msg.includes('kid')) {
        fallbackText += "I recommend consulting a Pediatrician for child health concerns. Children need specialized care.";
        suggestedSpec = 'Pediatrician';
      } else if (msg.includes('bone') || msg.includes('joint') || msg.includes('fracture') || msg.includes('back pain')) {
        fallbackText += "I recommend consulting an Orthopedic specialist for bone and joint issues.";
        suggestedSpec = 'Orthopedic';
      } else if (msg.includes('stomach') || msg.includes('abdomen') || msg.includes('nausea') || msg.includes('vomit')) {
        fallbackText += "I recommend consulting a Gastroenterologist for digestive concerns.";
        suggestedSpec = 'Gastroenterologist';
      } else if (msg.includes('eye') || msg.includes('vision') || msg.includes('sight')) {
        fallbackText += "I recommend consulting an Ophthalmologist for vision or eye-related issues.";
        suggestedSpec = 'Ophthalmologist';
      } else if (msg.includes('ear') || msg.includes('nose') || msg.includes('throat') || msg.includes('sinus')) {
        fallbackText += "I recommend consulting an ENT Specialist for ear, nose, or throat concerns.";
        suggestedSpec = 'ENT Specialist';
      } else if (msg.includes('medicine') || msg.includes('tablet') || msg.includes('drug')) {
        fallbackText += "for medication information, I recommend consulting a pharmacist or your General Physician.";
      } else if (msg.includes('fever') || msg.includes('cough') || msg.includes('cold')) {
        fallbackText += "I recommend consulting a General Physician for these common symptoms.";
      } else {
        fallbackText += "I recommend consulting a General Physician for proper evaluation and guidance.";
      }
      
      fallbackText += " You can easily book an appointment through our platform.";
      
      const errorMessage = {
        type: 'bot',
        text: fallbackText,
        timestamp: new Date(),
        isError: false, // Don't show as error since we have intelligent fallback
        suggestedSpecialization: suggestedSpec
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const quickQuestions = [
    "I have chest pain and shortness of breath",
    "What is Paracetamol used for?",
    "I feel dizzy and tired",
    "Tell me about diabetes"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-3xl">
              🤖
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Health Assistant</h1>
              <p className="text-gray-600">Powered by Google Gemini AI</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${message.type === 'user' ? 'bg-blue-500 text-white' : message.isError ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'} rounded-2xl p-4 shadow`}>
                  
                  {message.type === 'bot' && !message.isError && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">🤖</span>
                      <span className="font-semibold text-sm">AI Assistant</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{message.text}</p>

                  {/* Doctor Suggestion Card */}
                  {message.doctorName && (
                    <div className="mt-4 bg-white rounded-lg p-4 shadow-md border-2 border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">👨‍⚕️</span>
                        <h3 className="font-bold text-gray-800">Recommended Doctor</h3>
                      </div>
                      <p className="text-gray-700"><strong>Name:</strong> {message.doctorName}</p>
                      <p className="text-gray-700"><strong>Specialization:</strong> {message.suggestedSpecialization}</p>
                      
                      <button 
                        onClick={() => window.location.href = `/patient/dashboard`}
                        className="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                      >
                        📅 Book Appointment
                      </button>
                    </div>
                  )}

                  <p className="text-xs mt-2 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-4 shadow">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-600 mb-2 font-semibold">💡 Quick Questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left text-sm bg-white border border-gray-200 rounded-lg p-2 hover:bg-blue-50 hover:border-blue-300 transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your health question here..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
              >
                {isLoading ? '...' : '📤 Send'}
              </button>
            </div>
          </form>

        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Disclaimer:</strong> This AI assistant provides general health information only. 
            Always consult with a qualified healthcare professional for proper medical diagnosis and treatment.
          </p>
        </div>

      </div>
    </div>
  );
}

export default AIHealthAssistant;
