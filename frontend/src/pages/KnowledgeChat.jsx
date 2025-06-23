import React, { useState } from "react";
import "../styles/KnowledgeChat.css";
import axios from "axios";

const KnowledgeChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "👋 Hello! I'm your Knowledge Assistant AI. How can I help you today?",
    },
  ]);
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    const response = await axios.post("http://127.0.0.1:8000/search/search", {
      query: userInput,
      top_k: 3,
    });
    const { answer, source_files } = response.data;
    const reply = {
      sender: "assistant",
      text: answer + "\nSources: " + source_files.join(", "),
    };
    setMessages((prev) => [...prev, reply]);
  };

  return (
    <div className="chat-container">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message ${msg.sender}`}>
          {msg.text}
        </div>
      ))}
      <div className="chat-input-area">
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your question..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default KnowledgeChat;
