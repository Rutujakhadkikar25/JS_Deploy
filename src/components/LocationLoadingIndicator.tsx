import React from 'react';

const LocationLoadingIndicator = () => {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="card border-0 text-center p-4 shadow-sm" style={{ maxWidth: '400px' }}>
        <div className="mb-4">
          <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <h4 className="mb-3">Detecting Your Location</h4>
        <div className="d-flex justify-content-center mb-3">
          <div className="spinner-border text-primary spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mb-0">Please wait while we find your address</p>
        </div>
        <small className="text-muted">This may take a few moments</small>
      </div>
    </div>
  );
};

export default LocationLoadingIndicator;