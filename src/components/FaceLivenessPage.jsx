import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FaceLiveness from "./FaceLiveness";
import { Amplify } from "aws-amplify";
import { ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { View, Flex } from "@aws-amplify/ui-react";
import awsexports from "../aws-exports";
import "bootstrap/dist/css/bootstrap.min.css";
import haversine from "haversine-distance";
import LocationLoadingIndicator from "./LocationLoadingIndicator";
import LocationErrorScreen from "./LocationErrorScreen";
import CameraAccessDenied from "./CameraAccessDenied";
import LivenessCheckFailure from "./LivenessCheckFailure"; // Import the new component
import "../css/FaceLivenessPage.css";

const GEOFENCE_CENTER = {
  latitude: parseFloat(import.meta.env.VITE_GEOFENCE_LATITUDE) || 0,
  longitude: parseFloat(import.meta.env.VITE_GEOFENCE_LONGITUDE) || 0,
};
const RADIUS = parseInt(import.meta.env.VITE_RADIUS, 10) || 50;
const TIME_DIFFERENCE = parseInt(import.meta.env.VITE_TIME_DIFFERENCE);
Amplify.configure(awsexports);

function FaceLivenessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jwtToken, source, forceFlag } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [navigateTarget, setNavigateTarget] = useState(null);

  const [isWithinGeofence, setIsWithinGeofence] = useState(true);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isOverriden, setIsOverriden] = useState(false);
  const [showRestartMessage, setShowRestartMessage] = useState(false);
  const [currentTime, setCurrentTime] = useState();
  const [distanceFromLoc, setDistanceFromLoc] = useState(0);
  const [address, setAddress] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showFaceLiveness, setShowFaceLiveness] = useState(false);
  const [cameraAccessDenied, setCameraAccessDenied] = useState(false);
  const [livenessCheckFailed, setLivenessCheckFailed] = useState(false); // Add new state for liveness check failure

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setIsLoading(true);
        const latitude = parseFloat(window?.ReactNativeProps?.location.latitude);
        const longitude = parseFloat(window?.ReactNativeProps?.location.longitude);

        const response = await axios.get(`/api/get-address?latitude=${latitude}&longitude=${longitude}`);
        console.log(response);
        if (response.data.address) {
          setAddress(response.data.address);
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Error fetching address");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddress();
  }, []);

  useEffect(() => {
    const checkGeofence = () => {
      if (showRestartMessage || isOverriden) return;
      if (window.ReactNativeProps) {
        const currentTimeStamp = Date.now();
        const location = window.ReactNativeProps.location;
        const distance = haversine(GEOFENCE_CENTER, {
          latitude: location.latitude,
          longitude: location.longitude,
        });

        const timeDiff = currentTimeStamp - window.ReactNativeProps.timestamp;
        const isValidTimeDiff = timeDiff <= TIME_DIFFERENCE;
        const isInGeofence = distance <= RADIUS;
        setCurrentTime(currentTimeStamp);
        setDistanceFromLoc(distance);
        if (isValidTimeDiff && isInGeofence) {
          setIsWithinGeofence(true);
          setIsTimeout(false);
          return;
        } else if (!isValidTimeDiff && isInGeofence) {
          setIsTimeout(true);
          setIsWithinGeofence(true);
          return;
        }
        setIsWithinGeofence(false);
        setIsTimeout(true);
      }
    };
    checkGeofence();
    const interval = setInterval(checkGeofence, 30000);
    return () => clearInterval(interval);
  }, [isOverriden]);

  const onClickOverride = () => {
    setIsOverriden(true);
    setIsWithinGeofence(true);
    setIsTimeout(false);
  };

  const handleFaceLivenessComplete = async (confidence, data) => {
    console.log('handlefacelivenss data:', data);
    const attendance = JSON.parse(localStorage.getItem("attendanceData"));
    
    if (confidence < 70) {
      // Show liveness check failure screen instead of navigating
      setLivenessCheckFailed(true);
      setShowFaceLiveness(false);
    } else {
      const newMessages = [];
      try {
        if (source === "RecordAttendance") {
          newMessages.push("Attendance recorded successfully.");
          console.log("Setting target to /employeedetail in localStorage.");
          localStorage.setItem("messages", JSON.stringify(newMessages));
          localStorage.setItem("target", "/employeedetail");

          navigate("/results", {
            state: {
              jsonData: data
            }
          });
        } else if (source === "CheckoutAttendance") {
          newMessages.push("Checkout recorded successfully.");
          console.log("Setting target to /employeedetail in localStorage.");
          localStorage.setItem("messages", JSON.stringify(newMessages));
          localStorage.setItem("target", "/employeedetail");
          navigate("/results", {
            state: {
              jsonData: data
            }
          });
        }
      } catch (error) {
        const newMessages = ["Failed to record action. Please try again."];
        console.error(
          "Failed to record attendance. Setting fallback target in localStorage."
        );
        localStorage.setItem("messages", JSON.stringify(newMessages));
        localStorage.setItem("target", "/recordAttendance");
        navigate("/results");
      }
    }
  };

  const onClickCancel = () => {
    setShowRestartMessage(true);
    setIsTimeout(false);
    setIsWithinGeofence(false);
  };

  const startLivenessCheck = () => {
    // Reset any previous failures
    setLivenessCheckFailed(false);
    
    // Check if camera is available before showing face liveness
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          setShowFaceLiveness(true);
          setCameraAccessDenied(false);
        })
        .catch(() => {
          setCameraAccessDenied(true);
        });
    } else {
      setCameraAccessDenied(true);
    }
  };

  const handleRetryCamera = () => {
    // Try to access camera again
    setCameraAccessDenied(false);
    startLivenessCheck();
  };
  
  const handleRetryLivenessCheck = () => {
    // Retry the liveness check
    setLivenessCheckFailed(false);
    startLivenessCheck();
  };

  const handleRetryLocationCheck = () => {
    // Retrigger the geofence check
    setIsLoading(true);
    setTimeout(() => {
      const checkGeofence = () => {
        if (window.ReactNativeProps) {
          const currentTimeStamp = Date.now();
          const location = window.ReactNativeProps.location;
          const distance = haversine(GEOFENCE_CENTER, {
            latitude: location.latitude,
            longitude: location.longitude,
          });
  
          const timeDiff = currentTimeStamp - window.ReactNativeProps.timestamp;
          const isValidTimeDiff = timeDiff <= TIME_DIFFERENCE;
          const isInGeofence = distance <= RADIUS;
          setCurrentTime(currentTimeStamp);
          setDistanceFromLoc(distance);
          if (isValidTimeDiff && isInGeofence) {
            setIsWithinGeofence(true);
            setIsTimeout(false);
          } else if (!isValidTimeDiff && isInGeofence) {
            setIsTimeout(true);
            setIsWithinGeofence(true);
          } else {
            setIsWithinGeofence(false);
            setIsTimeout(true);
          }
        }
      };
      checkGeofence();
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return <LocationLoadingIndicator />;
  }

  // Show LivenessCheckFailure component when liveness check fails
  if (livenessCheckFailed) {
    return <LivenessCheckFailure onRetry={handleRetryLivenessCheck} />;
  }

  // Camera access denied screen - using the imported component
  if (cameraAccessDenied) {
    return <CameraAccessDenied onRetry={handleRetryCamera} />;
  }

  // Location success screen based on Figma design
  if (isWithinGeofence && !isTimeout && !showFaceLiveness) {
    return (
      <div className="success-container">
        <div className="success-header">
          Attendance System
        </div>
        
        <div className="success-card">
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
          
          {/* Success message */}
          <div className="location-success-message">
            you are in location area!
          </div>
          
          {/* Location address */}
          <div className="location-address">
            {address || "Location, Do no, street no, road number, near by place etc..."}
          </div>
          
          {/* Start button */}
          <div className="start-button-container">
            <button 
              onClick={startLivenessCheck}
              className="start-button"
            >
              Start Liveness Check!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show Face Liveness Component when user clicks the start button
  if (showFaceLiveness) {
    return (
      <ThemeProvider>
        <Flex
          direction="row"
          justifyContent="center"
          alignItems="center"
          alignContent="flex-start"
          wrap="nowrap"
          gap="1rem"
          style={{ height: "100vh" }}
        >
          <View
            as="div"
            maxHeight="600px"
            height="600px"
            width="740px"
            maxWidth="740px"
          >
            <FaceLiveness
              faceLivenessAnalysis={handleFaceLivenessComplete}
              jwtToken={jwtToken}
              latitude={window?.ReactNativeProps?.location.latitude}
              longitude={window?.ReactNativeProps?.location.longitude}
              radius={RADIUS}
              overrideFlag={isOverriden}
              distance={distanceFromLoc}
            />
          </View>
        </Flex>
      </ThemeProvider>
    );
  }

  // Timeout error
  if (isTimeout && isWithinGeofence) {
    return (
      <div className="timeout-container">
        <h1 className="timeout-heading">Taken too long to mark attendance</h1>
        <p className="timeout-text">You have opened app at {new Date(window.ReactNativeProps.timestamp).toLocaleString()} </p>
        <p className="timeout-text">Checked-in at {new Date(currentTime).toLocaleString()}</p>
        <h2 className="timeout-question">Do you want to force check-in?</h2>
        <div className="button-container">
          <button
            className="override-button"
            type="button"
            onClick={onClickOverride}
          >
            Override
          </button>
          <button
            className="cancel-button"
            type="button"
            onClick={onClickCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Show restart message
  if (showRestartMessage) {
    return (
      <div className="restart-container">
        <h1 className="restart-heading">Restart the App</h1>
        <p className="restart-text">
          To mark attendance, please restart the app when you are at
          the desired location.
        </p>
      </div>
    );
  }

  // Use the new error screen component when not in geofence
  return (
    <LocationErrorScreen
      distance={distanceFromLoc}
      allowedRadius={RADIUS}
      unit={distanceFromLoc > 1000 ? "km" : "mtr"}
      onRetry={handleRetryLocationCheck}
      onOverride={onClickOverride}
    />
  );
}

export default FaceLivenessPage;