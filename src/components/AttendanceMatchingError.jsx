import React from 'react';
import '../css/AttendanceMatchingError.css'; // Import the CSS file

const AttendanceMatchingError = ({ onTryAgainClick }) => {
  return (
    <div className="attendance-container">
      {/* Header */}
      <div className="attendance-header">
        <h1 className="attendance-title">Attendance System</h1>
      </div>
      
      {/* Main content */}
      <div className="attendance-content">
        <div className="content-box">
          {/* Sad face icon */}
          <div className="sad-face">
            <div className="eye left"></div>
            <div className="eye right"></div>
            <div className="mouth"></div>
            <div className="bottom"></div>
          </div>
          
          {/* Error message */}
          <h2 className="error-message">Face Recognition failed...</h2>
          
          {/* Description */}
          <p className="description">
            We confirm you are physically present but we couldn't recognize your face
          </p>
          
          {/* Instructions */}
          <p className="instructions">
            Please ensure your face is clear, centered, well-visible, and directly facing the camera
          </p>
          
          {/* View details link */}
          <div className="details-link">
            <a href="#" className="details-text">View details</a>
          </div>
          
          {/* Try again button */}
          <button 
            onClick={onTryAgainClick} 
            className="try-again-button"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMatchingError;