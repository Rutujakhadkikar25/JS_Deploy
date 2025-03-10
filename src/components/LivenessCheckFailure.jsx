import React from 'react';
import '../css/LivenessCheckFailure.css';

const LivenessCheckFailure = ({ onRetry }) => {
  return (
    <div className="liveness-failure-container">
      <div className="liveness-failure-header">
        Attendance System
      </div>
      
      <div className="liveness-failure-card">
        {/* Sad Face Icon */}
        <div className="sad-face-icon">
          <div className="sad-face-inner">
            <div className="sad-face-eyes">
              <div className="sad-face-eye"></div>
              <div className="sad-face-eye"></div>
            </div>
            <div className="sad-face-mouth-frown"></div>
          </div>
        </div>

        {/* Error Message */}
        <p className="liveness-error-title">we recognize you but...</p>
        
        <p className="liveness-error-message">
          We identified you as Employee Name, but we couldn't confirm you're a live person
        </p>

        {/* Instructions */}
        <div className="liveness-instructions">
             <p className="instruction-heading">Here is what you can do:</p>
              <ol className="instruction-list">
               <li className="instruction-item">Find a well-lit spot</li>
               <li className="instruction-item">Make sure your face is clear and centered</li>
               <li className="instruction-item">Avoid using photos or videos</li>
              </ol>
        </div>

        {/* Retry Button */}
        <button 
          className="retry-button"
          onClick={onRetry}
        >
          Retry Liveness Check
        </button>
      </div>
    </div>
  );
};

export default LivenessCheckFailure;