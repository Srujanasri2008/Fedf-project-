import React, { useEffect, useMemo, useState } from "react";
import "./VideoInterface.css";

const VideoInterface = () => {
  const currentUser = JSON.parse(localStorage.getItem("telemed_current_user") || "{}");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadAppointments = () => {
      setAppointments(JSON.parse(localStorage.getItem("telemed_appointments") || "[]"));
    };

    loadAppointments();
    window.addEventListener("storage", loadAppointments);
    window.addEventListener("telemed:appointments-updated", loadAppointments);

    return () => {
      window.removeEventListener("storage", loadAppointments);
      window.removeEventListener("telemed:appointments-updated", loadAppointments);
    };
  }, []);

  const appointment = useMemo(() => {
    const normalizedUserEmail = (currentUser.email || "").toLowerCase();
    const normalizedUserName = (currentUser.name || "").toLowerCase();

    return appointments.find((item) => {
      if (currentUser.role === "doctor") {
        return (
          (item.doctorEmail || "").toLowerCase() === normalizedUserEmail ||
          (item.doctor || "").toLowerCase() === normalizedUserName
        );
      }

      return (
        (item.patientEmail || "").toLowerCase() === normalizedUserEmail ||
        (item.patientName || "").toLowerCase() === normalizedUserName
      );
    }) || null;
  }, [appointments, currentUser]);

  const [callState, setCallState] = useState("Ready to start a secure consultation.");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState("");

  // Chat state management
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const handleStartCall = () => {
    setError("");
    setIsConnecting(true);
    setCallState("Connecting to the consultation room...");

    window.setTimeout(() => {
      setIsConnecting(false);
      setCallState("Call started successfully. Doctor is ready.");
    }, 900);
  };

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);
    setCallState(isMuted ? "Microphone unmuted." : "Microphone muted.");
    setError("");
  };

  const handleEndCall = () => {
    setIsConnecting(false);
    setError("");
    setCallState("Call ended safely.");
  };

  // Chat handlers
  const handleSendMessage = () => {
    if (chatInput.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      sender: currentUser.name || "You",
      role: currentUser.role,
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="video-interface-wrapper">
      <div className="module-box video-card">
        <div className="video-header">
          <div>
            <p className="eyebrow">Live consultation</p>
            <h3>Video Interface</h3>
          </div>
          <span className="live-chip">LIVE</span>
        </div>

        <p className="video-subtext">Use this panel to begin, monitor, and finish your secure consultation.</p>

        <div className="video-panel">
          <div className="video-screen">
            <div className="video-content">
              <div className="video-background">
                <div className="video-placeholder-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                    <path d="M28 50C28 42.268 34.268 36 42 36C49.732 36 56 42.268 56 50" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="42" cy="30" r="5" fill="currentColor"/>
                  </svg>
                </div>
                <div className="camera-status">
                  <div className="status-indicator">
                    <span className={`status-dot ${isConnecting ? "connecting" : "idle"}`}></span>
                    <span className="status-text">
                      {isConnecting ? "Connecting..." : "Ready to start"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="video-footer">
                <div className="video-info">
                  <div className="info-item">
                    <span className="info-label">Camera</span>
                    <span className={`info-value ${isMuted ? "off" : "on"}`}>
                      {isMuted ? "OFF" : "ON"}
                    </span>
                  </div>
                  <div className="divider"></div>
                  <div className="info-item">
                    <span className="info-label">Microphone</span>
                    <span className={`info-value ${isMuted ? "off" : "on"}`}>
                      {isMuted ? "MUTED" : "ACTIVE"}
                    </span>
                  </div>
                </div>
                <div className="video-timer">
                  <span className="timer-icon">⏱</span>
                  <span className="timer-text">00:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="video-meta">
            <div className="meta-box"><strong>Patient:</strong> {appointment?.patientName || "No patient booked yet"}</div>
            <div className="meta-box"><strong>Doctor:</strong> {appointment?.doctor || "No doctor assigned"}</div>
            <div className="meta-box"><strong>Time:</strong> {appointment ? `${appointment.date} • ${appointment.time}` : "Waiting for booking"}</div>
            <div className="meta-box"><strong>Reason:</strong> {appointment?.reason || "No reason added yet"}</div>
            <div className="meta-box"><strong>Status:</strong> {isMuted ? "Muted" : "Listening"}</div>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <h4>Patient details</h4>
            <p><strong>Name:</strong> {appointment?.patientName || "Not available"}</p>
            <p><strong>Phone:</strong> {appointment?.phone || "Not available"}</p>
            <p><strong>Age / Gender:</strong> {appointment ? `${appointment.age} • ${appointment.gender}` : "Not available"}</p>
          </div>

          <div className="detail-card">
            <h4>Doctor details</h4>
            <p><strong>Name:</strong> {appointment?.doctor || "Not available"}</p>
            <p><strong>Role:</strong> {currentUser.role === "doctor" ? "Doctor" : "Doctor"}</p>
            <p><strong>Email:</strong> {appointment?.doctorEmail || "Not available"}</p>
          </div>
        </div>

        <div className="video-btns">
          <button onClick={handleStartCall} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Start Call"}
          </button>
          <button onClick={handleMuteToggle}>{isMuted ? "Unmute" : "Mute"}</button>
          <button onClick={handleEndCall}>End Call</button>
          <button 
            onClick={() => setShowChat(!showChat)} 
            className="btn-chat"
            title="Toggle chat panel"
          >
            {showChat ? "Hide Chat" : "Open Chat"}
          </button>
        </div>

        <p className="status-pill">Status: {callState}</p>
        {error ? <p className="error-message">{error}</p> : null}
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="chat-panel">
          <div className="chat-header">
            <h3>Consultation Chat</h3>
            <button 
              onClick={() => setShowChat(false)} 
              className="close-btn"
              title="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="chat-placeholder">
                <p>No messages yet. Start typing to begin conversation.</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`chat-message ${msg.role === currentUser.role ? "sent" : "received"}`}
                >
                  <div className="message-header">
                    <span className="sender-name">{msg.sender}</span>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                  <div className="message-text">{msg.text}</div>
                </div>
              ))
            )}
          </div>

          <div className="chat-input-area">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              rows="3"
              className="chat-textarea"
            />
            <button 
              onClick={handleSendMessage}
              disabled={chatInput.trim() === ""}
              className="btn-send"
            >
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoInterface;