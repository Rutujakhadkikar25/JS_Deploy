import React from 'react';
import '../css/AttendanceErrorCard.css';

const AttendanceErrorCard = ({ 
  errorMessage = "Looks like we couldn't confirm it's you",
  instructions = "Please ensure you are in a well-lit area, your face is clrealy visible, and you are not using photos or videos.",
  onRetryClick
}) => {
  return (
    <div className="attendance-error-container">
      <div className="attendance-header">
        <h1 className="attendance-title">Attendance System</h1>
      </div>
      
      <div className="attendance-card">
        <div className="error-icon-container">
          <div className="sad-face">
            <div className="eyes">
              <div className="eye"></div>
              <div className="eye"></div>
            </div>
            <div className="mouth"></div>
          </div>
        </div>
        
        <h2 className="error-message">{errorMessage}</h2>
        <p className="error-instructions">{instructions}</p>
        
        <button className="retry-button" onClick={onRetryClick}>
          Retry
        </button>
      </div>
    </div>
  );
};

export default AttendanceErrorCard;