import React from "react";
import "../css/LocationErrorScreen.css";

function LocationErrorScreen({ 
  distance, 
  allowedRadius = 10, 
  onRetry, 
  onOverride, 
  unit = "meter" 
}) {
  // Format distance to be readable
  const formattedDistance = Math.round(distance);
  
  return (
    <div className="location-error-container">
      {/* Header */}
      <div className="location-error-header">
        Attendance System
      </div>
      
      {/* White Card */}
      <div className="location-error-card">
        {/* Location pin icon */}
        <div className="location-pin-container">
          <svg width="60" height="75" viewBox="0 0 60 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 0C13.5 0 0 13.5 0 30C0 52.5 30 75 30 75C30 75 60 52.5 60 30C60 13.5 46.5 0 30 0ZM30 40.5C24.2 40.5 19.5 35.8 19.5 30C19.5 24.2 24.2 19.5 30 19.5C35.8 19.5 40.5 24.2 40.5 30C40.5 35.8 35.8 40.5 30 40.5Z" fill="#FF3333"/>
            <ellipse cx="30" cy="65" rx="15" ry="3" fill="#CCCCCC" fillOpacity="0.5"/>
          </svg>
        </div>
        
        {/* Status text */}
        <div className="location-status-text">
          checking your location...
        </div>
        
        {/* Error message */}
        <div className="location-error-message">
          you are not in radius area
        </div>
        
        {/* Distance information */}
        <div className="location-distance-info">
          <p>your current distance:{formattedDistance} {unit}</p>
          <p>Allowed Radius:{allowedRadius} {unit}</p>
        </div>
        
        {/* Buttons */}
        <div className="location-buttons-container">
          <button 
            onClick={onRetry}
            className="location-button"
          >
            Retry Location Check
          </button>
          
          <button 
            onClick={onOverride}
            className="location-button"
          >
            Override Location
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationErrorScreen;