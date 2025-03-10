import React from "react";
import "../css/CameraAccessDenied.css"; // Make sure to create this CSS file

function CameraAccessDenied({ onRetry }) {
  return (
    <div className="camera-denied-container">
      <div className="camera-denied-header">
        Attendance System
      </div>
      
      <div className="camera-denied-card">
        <div className="camera-icon-container">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="10" fill="#000000" />
            <circle cx="50" cy="40" r="15" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="30" y="65" width="40" height="5" rx="2.5" fill="#FFFFFF" />
            <line x1="65" y1="25" x2="35" y2="55" stroke="#FF0000" strokeWidth="3" />
            <line x1="35" y1="25" x2="65" y2="55" stroke="#FF0000" strokeWidth="3" />
          </svg>
        </div>
        
        <div className="camera-denied-title">
          camera access denied
        </div>
        
        <div className="camera-denied-text">
          We need access to camera to complete liveness check
        </div>
        
        <div className="camera-fix-steps">
          <div className="fix-step-title">Here is how to fix:</div>
          <ol className="fix-steps-list">
            <li>Open your device setting</li>
            <li>Go to app permission</li>
            <li>Enable camera access</li>
          </ol>
        </div>
        
        <div className="retry-button-container">
          <button 
            onClick={onRetry}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

export default CameraAccessDenied;