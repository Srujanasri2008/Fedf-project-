import React, { useState } from "react";

const PreCallCheck = () => {
  const [status, setStatus] = useState("Ready to test your consultation setup.");

  const runCheck = (item) => {
    setStatus(`${item} is working properly. Your consultation can continue.`);
  };

  return (
    <div className="module-box">
      <p>Run these checks before starting a consultation.</p>

      <div className="history-card">
        <p><strong>Camera:</strong> HD camera detected</p>
        <button onClick={() => runCheck("Camera")}>Check Camera</button>
      </div>

      <div className="history-card">
        <p><strong>Microphone:</strong> Audio input is active</p>
        <button onClick={() => runCheck("Microphone")}>Check Mic</button>
      </div>

      <div className="history-card">
        <p><strong>Internet:</strong> Stable connection available</p>
        <button onClick={() => runCheck("Internet")}>Check Network</button>
      </div>

      <p className="success-message">{status}</p>
    </div>
  );
};

export default PreCallCheck;