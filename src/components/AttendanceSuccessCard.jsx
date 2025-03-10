import React from 'react';
import '../css/AttendanceSuccessCard.css';
import { CheckCircle } from 'lucide-react';

const AttendanceSuccessCard = ({
  employeeName = "Employee Name",
  employeeId = "DEDOL-00001",
  date = "Feb 21, 2025",
  location = "Office location etc..",
  checkInTime = "9:00AM",
  checkOutTime = null,
  onDoneClick
}) => {
  return (
    <div className="attendance-success-container">
      <div className="attendance-header">
        <h1 className="attendance-title">Attendance System</h1>
      </div>
      
      <div className="attendance-card">
        <div className="success-icon-container">
          <CheckCircle className="success-check-icon" />
        </div>
        
        <h2 className="success-message">Congrats!</h2>
        <p className="success-description">Your attendence has been recorded</p>
        
        <div className="employee-avatar"></div>
        <div className="employee-name">{employeeName}</div>
        
        <div className="attendance-details">
          <div className="details-row">
            <div className="details-column">
              <div className="details-label">Employee ID</div>
              <div className="details-value">{employeeId}</div>
            </div>
            <div className="details-column">
              <div className="details-label">Date</div>
              <div className="details-value">{date}</div>
            </div>
          </div>
          
          <div className="details-row">
            <div className="details-column">
              <div className="details-label">Location</div>
              <div className="details-value">{location}</div>
            </div>
            <div className="details-column">
              <div className="details-label">Check-in</div>
              <div className="details-value">{checkInTime}</div>
            </div>
          </div>
          
          {checkOutTime && (
            <div className="details-row checkout-row">
              <div className="details-column">
                <div className="details-label">Check-out</div>
                <div className="details-value">{checkOutTime}</div>
              </div>
              <div className="details-column"></div>
            </div>
          )}
        </div>
        
        <button className="done-button" onClick={onDoneClick}>
          Done
        </button>
      </div>
    </div>
  );
};

export default AttendanceSuccessCard;