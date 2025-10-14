import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, patientAPI, messageAPI } from '../services/api';

function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const type = localStorage.getItem('userType');
    
    if (!userData) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setUserType(type);
    loadContacts(type);
  }, [navigate]);

  const loadContacts = async (type) => {
    try {
      if (type === 'doctor') {
        const response = await patientAPI.getAll();
        setContacts(response.data);
      } else {
        const response = await doctorAPI.getAll();
        setContacts(response.data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const loadMessages = async (contactId) => {
    try {
      const response = await messageAPI.getConversation(user.id, contactId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    loadMessages(contact.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: user.id,
      receiverId: selectedContact.id,
      senderName: user.name,
      senderType: userType.toUpperCase(),
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    try {
      await messageAPI.send(messageData);
      setNewMessage('');
      loadMessages(selectedContact.id);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleBack = () => {
    if (userType === 'doctor') {
      navigate('/doctor/dashboard');
    } else {
      navigate('/patient/dashboard');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="navbar">
        <h2>🏥 HealthConnect - Chat</h2>
        <button onClick={handleBack} className="btn" style={{ background: 'white', color: '#007bff' }}>
          Back to Dashboard
        </button>
      </div>

      <div className="container">
        <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)' }}>
          {/* Contacts List */}
          <div className="card" style={{ width: '300px', overflow: 'auto' }}>
            <h3>Contacts</h3>
            {contacts.length === 0 ? (
              <p>No contacts available.</p>
            ) : (
              <div>
                {contacts.map(contact => (
                  <div 
                    key={contact.id}
                    onClick={() => handleContactSelect(contact)}
                    style={{
                      padding: '15px',
                      borderBottom: '1px solid #ddd',
                      cursor: 'pointer',
                      backgroundColor: selectedContact?.id === contact.id ? '#e3f2fd' : 'white'
                    }}
                  >
                    <h4 style={{ margin: 0 }}>{contact.name}</h4>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                      {userType === 'doctor' ? 'Patient' : contact.specialization}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedContact ? (
              <>
                <div style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                  <h3 style={{ margin: 0 }}>{selectedContact.name}</h3>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                    {userType === 'doctor' ? 'Patient' : `Dr. ${selectedContact.specialization}`}
                  </p>
                </div>

                <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
                  {messages.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>No messages yet. Start the conversation!</p>
                  ) : (
                    messages.map(msg => (
                      <div 
                        key={msg.id}
                        style={{
                          marginBottom: '15px',
                          display: 'flex',
                          justifyContent: msg.senderId === user.id ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div 
                          style={{
                            maxWidth: '60%',
                            padding: '10px 15px',
                            borderRadius: '10px',
                            backgroundColor: msg.senderId === user.id ? '#007bff' : '#f1f1f1',
                            color: msg.senderId === user.id ? 'white' : 'black'
                          }}
                        >
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
                            {msg.senderName}
                          </p>
                          <p style={{ margin: '5px 0' }}>{msg.message}</p>
                          <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
                            {new Date(msg.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form 
                  onSubmit={handleSendMessage}
                  style={{ padding: '15px', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <p style={{ color: '#666' }}>Select a contact to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
