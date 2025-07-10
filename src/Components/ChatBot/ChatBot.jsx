import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import coco_animated from "../../assets/images/coco_animated1.webm";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);

  const toggleChat = () => {
    setChatVisible(prev => {
      const newState = !prev;
      if (!newState && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      return newState;
    });
  };

  const handleUserInput = async () => {
    if (!userInput.trim()) return;
    const newMessage = { role: 'user', content: userInput };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("https://quindishoes-backend-def.onrender.com/api/chat", {
        question: userInput,
        history: updatedMessages,
      });
      const assistantMessage = {
        role: 'assistant',
        content: formatResponse(response.data.reply),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error en la comunicación con el backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (text) => {
    const formatted = text
      .replace(/\d+\./g, match => `\n${match}`)
      .replace(/\*\s/g, '• ');
    return formatted.trim();
  };

  useEffect(() => {
    if (chatVisible) {
      axios.post("https://quindishoes-backend-def.onrender.com/enviarProductosAI")
        .then(response => console.log('Productos enviados:', response.data))
        .catch(error => console.error('Error al enviar productos:', error));

      if (messages.length === 0) {
        setMessages([{
          role: 'assistant',
          content: '¡Hola! 👋 Soy Coco, tu asistente virtual.\n\nEstoy aquí para ayudarte a encontrar el producto ideal, resolver tus dudas o guiarte en tu compra. ¿En qué puedo ayudarte hoy? 💬'
        }]);
      }
    }
  }, [chatVisible]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      <motion.div
        onClick={toggleChat}
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        style={{ position: 'fixed', bottom: '20px', right: '20px', width: '120px', height: '120px', cursor: 'pointer', zIndex: 1000 }}
      >
        <video
          ref={videoRef}
          src={coco_animated}
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
        />
      </motion.div>

      <AnimatePresence>
        {chatVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              bottom: '140px',
              right: '20px',
              width: '400px',
              height: '600px',
              background: 'linear-gradient(135deg, #fff0f5 0%, #e0fbe0 100%)',
              borderRadius: '25px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 999,
              backdropFilter: 'blur(6px)'
            }}
          >
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginBottom: '10px',
                    maxWidth: '85%'
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{msg.role === 'user' ? '👤' : '🤖'}</span>
                  <div style={{
                    background: msg.role === 'user' ? '#fbd3e9' : '#d2f8d2',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.5,
                    color: '#333'
                  }}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div style={{ fontStyle: 'italic', color: '#888' }}>Coco está escribiendo...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{
              padding: '10px 15px',
              borderTop: '1px solid #ddd',
              display: 'flex',
              backgroundColor: '#fff'
            }}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUserInput()}
                placeholder="Escribe un mensaje..."
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                  marginRight: '10px',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleUserInput}
                style={{
                  backgroundColor: '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
