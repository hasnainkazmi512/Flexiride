import React, { useState } from 'react';
import styles from '../styles/ChatArea.module.css';

const ChatArea = ({ customerName, onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: `Welcome to the chat with ${customerName}`, sender: 'system' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>Back</button>
<h3 style={{ textAlign: 'center', width: '100%' }}>{customerName}</h3>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.systemMessage}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles.messageInput}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

export default ChatArea;
