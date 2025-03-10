import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import AttendanceSuccessCard from './AttendanceSuccessCard';
import AttendanceErrorCard from './AttendanceErrorCard';
import AttendanceLivenessError from './AttendanceMatchingError';
import AttendanceServiceError from './AttendanceServiceError';
import AttendanceMatchingError from './AttendanceMatchingError';

const FaceLivenessResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jsonData } = location.state || {};

  if (!jsonData || !jsonData.body) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <AlertCircle className="me-2" />
          No result data available. Please try again.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/recordAttendance')}>
          Go Back
        </button>
      </div>
    );
  }

  const { face_liveness_result, face_detection_result, Attendance_response } = jsonData.body;

  const isRecognitionSuccess = face_liveness_result?.Status === 'SUCCEEDED';
  const isDetectionSuccess = face_detection_result?.Result === 'SUCCEEDED';
  const isAttendanceSuccess = Attendance_response?.response?.Result === 'SUCCEEDED';
  const recognitionConfidence = face_liveness_result?.Confidence || 0;
  const detectionConfidence = face_detection_result?.SearchedFaceConfidence || 0;

  // Case 1: All checks passed successfully - use the AttendanceSuccessCard
  if (isRecognitionSuccess && isDetectionSuccess && isAttendanceSuccess) {
    return (
      <AttendanceSuccessCard 
        employeeName={face_detection_result.EmployeeName}
        employeeId={face_detection_result.EmployeeId}
        date={Attendance_response.response.date}
        location="Office location" // Add actual location if available in the data
        checkInTime={Attendance_response.response.checkInTime}
        checkOutTime={Attendance_response.response.checkOutTime || null}
        onDoneClick={() => navigate('/recordAttendance')}
      />
    );
  }

  // Case 2: Recognition and Detection success but Attendance failed
  if (isRecognitionSuccess && isDetectionSuccess && !isAttendanceSuccess) {
    return (
      <AttendanceServiceError
        employeeName={face_detection_result.EmployeeName}
        onRetryClick={() => navigate('/recordAttendance')}
      />
    );
  }

  // Case 3: Both Recognition and Detection failed - use the AttendanceErrorCard
  if (!isRecognitionSuccess && !isDetectionSuccess) {
    return (
      <AttendanceErrorCard 
        errorMessage="Looks like we couldn't confirm it's you"
        instructions="Please ensure you are in a well-lit area, your face is clrealy visible, and you are not using photos or videos."
        onRetryClick={() => navigate('/faceliveness')}
      />
    );
  }

  // Case 4: Recognition success but Detection failed
  if (isRecognitionSuccess && !isDetectionSuccess) {
    return (
      <AttendanceMatchingError onTryAgainClick={() => navigate('/faceliveness')} />
    );
  }

  // Case 5: Recognition failed but Detection success
  if (!isRecognitionSuccess && isDetectionSuccess) {
    return (
      <AttendanceMatchingError onTryAgainClick={() => navigate('/faceliveness')} />
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="col-12 col-lg"></div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <button className="btn btn-primary" onClick={() => navigate('/recordAttendance')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceLivenessResult;


//face-reckoginitio-faceliveness same
//face-deteection-facematch