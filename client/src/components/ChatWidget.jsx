import React, { useState } from "react";
import axios from "axios";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const apiUrl = "http://localhost:8080/api/chatbot/query"; // change to deployed backend link if online

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg, time: new Date().toLocaleTimeString() }]);
    setInput("");
    try {
      const res = await axios.post(apiUrl, { message: userMsg });
      const data = res.data;
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data.reply || "No response received.",
          doctor: data.recommendedDoctor,
          spec: data.specialization,
          time: data.timestamp || new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { 
          from: "bot", 
          text: "I apologize, but I'm currently unable to connect to my medical knowledge base. However, I'm here to help. Based on your concern, I strongly recommend consulting with a healthcare professional who can provide you with proper medical attention. If this is an emergency, please call emergency services immediately.", 
          time: new Date().toLocaleTimeString() 
        },
      ]);
    }
  };

  return (
    <>
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <button 
          onClick={() => setOpen(!open)} 
          style={{ 
            padding: "12px 20px", 
            borderRadius: 25, 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
            color: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {open ? "✕ Close" : "🩺 Dr. AI - Virtual Doctor"}
        </button>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 70,
            right: 20,
            width: 320,
            height: 420,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: 12, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff", borderRadius: "8px 8px 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🩺</span>
              <div>
                <strong style={{ fontSize: "15px" }}>Dr. AI - Virtual Doctor</strong>
                <div style={{ fontSize: "11px", opacity: 0.9 }}>Professional Medical Guidance</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 10, background: "#f8f9fa" }}>
            {messages.length === 0 && (
              <div style={{ 
                textAlign: "center", 
                padding: "20px", 
                color: "#6c757d",
                fontSize: "13px"
              }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>👨‍⚕️</div>
                <p>Hello! I'm Dr. AI, your virtual health assistant.</p>
                <p>How can I help you today?</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 8, textAlign: m.from === "user" ? "right" : "left" }}>
                <div
                  style={{
                    display: "inline-block",
                    background: m.from === "user" ? "#667eea" : "#fff",
                    color: m.from === "user" ? "#fff" : "#333",
                    padding: "10px 14px",
                    borderRadius: 12,
                    maxWidth: "85%",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ fontSize: 13, lineHeight: "1.5" }}>{m.text}</div>
                  {m.doctor && (
                    <div style={{ 
                      fontSize: 12, 
                      marginTop: 8, 
                      padding: "8px", 
                      background: "#f0f4ff", 
                      borderRadius: 6,
                      borderLeft: "3px solid #667eea"
                    }}>
                      <div style={{ fontWeight: "600", color: "#667eea", marginBottom: "4px" }}>
                        👨‍⚕️ Recommended Specialist
                      </div>
                      <div><strong>{m.doctor}</strong></div>
                      <div style={{ fontSize: 11, color: "#6c757d" }}>{m.spec}</div>
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: m.from === "user" ? "rgba(255,255,255,0.7)" : "#94a3b8", marginTop: 4 }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #e0e0e0", padding: 8, background: "#fff", borderRadius: "0 0 8px 8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Describe your symptoms..."
              style={{ 
                flex: 1, 
                padding: "10px 12px", 
                border: "1px solid #e0e0e0", 
                borderRadius: 20,
                fontSize: "13px",
                outline: "none"
              }}
            />
            <button 
              onClick={sendMessage} 
              style={{ 
                marginLeft: 8, 
                padding: "8px 16px", 
                background: "#667eea", 
                color: "#fff", 
                border: "none", 
                borderRadius: 20,
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
