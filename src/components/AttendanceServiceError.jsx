import React from 'react';
import '../css/AttendanceServiceError.css';

const AttendanceServiceError = ({ employeeName, onRetryClick }) => {
  return (
    <div className="attendance-error-container">
      {/* Header with time and status icons */}
      
      
      {/* Title */}
      <div className="attendance-title">
        Attendance System
      </div>
      
      {/* Main content card */}
      <div className="attendance-error-card">
        {/* Error icon */}
        <div className="error-icon-container">
          <div className="error-icon">
            <span className="error-x">×</span>
          </div>
        </div>
        
        {/* Error message */}
        <div className="error-message">
          attendence service unavailable
        </div>
        
        {/* Description */}
        <div className="error-description">
          We successfully verified you as {employeeName || "Employee name"} but attendence service is unavailable
        </div>
        
        <div className="error-instruction">
          please try again later
        </div>
        
        {/* Retry button */}
        <button 
          className="retry-button"
          onClick={onRetryClick}
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default AttendanceServiceError;