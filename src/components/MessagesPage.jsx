import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {jsonData} = location.state?.jsonData || {};
  console.log(JSON.stringify(jsonData),'jsonData in messagpage')
  const [messages, setMessages] = useState([]);
  const [target, setTarget] = useState(null);
  const [themeColor, setThemeColor] = useState("#28a745"); // Default to success (green)
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("messages"));
    const storedTarget = localStorage.getItem("target");

    if (!storedTarget) {
      console.warn("No target found in localStorage. Redirecting to default page.");
      navigate("/"); // Fallback route
    } else {
      setMessages(storedMessages || []);
      setTarget(storedTarget);

      // Check if the message contains 'successfully' to set the theme color
      if (storedMessages?.some(msg => msg.toLowerCase().includes("successfully"))) {
        setThemeColor("#D4EDDA"); // Green for success
      } else {
        setThemeColor("#F8D7DA"); // Red for failure
      }

      const timer = setTimeout(() => {
        navigate(storedTarget);
      }, 80000)//djust delay as needed

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center "
      style={{
        width:"100vw",
        height:"100vh",// Ensures the container takes the full height of the screen
        backgroundColor: themeColor, // Set the background color based on the theme color (green/red)
        fontFamily: "'Roboto', sans-serif",
        margin: 0, // Prevents margin from causing spacing issues
        padding: 0, // Ensures no additional padding on the body or div
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "450px", // Makes the card responsive on smaller screens
          borderRadius: "20px",
          border: "none",
          background: "#ffffff",
        }}
      >
        <div className="text-center">
          <h4
            className="font-weight-bold mb-4"
            style={{
              color: themeColor === "#D4EDDA" ? "#155724" : "#721c24",
              fontSize: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            {themeColor === "#D4EDDA" ? "Success" : "Failure"} - Processing
          </h4>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            {themeColor === "#D4EDDA"
              ? "Operation completed successfully!"
              : "Something went wrong, please try again."}
          </p>
        </div>
        <div>
          {messages.length > 0 ? (
            <ul className="list-group list-group-flush">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className="list-group-item"
                  style={{
                    backgroundColor: themeColor === "#D4EDDA" ? "#d4edda" : "#f8d7da",
                    color: themeColor === "#D4EDDA" ? "#155724" : "#721c24",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    padding: "12px",
                    fontSize: "14px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease-in-out",
                  }}
                >
                  {msg}
                </li>
              ))}
            </ul>
          ) : (
            <p
              className="text-muted text-center"
              style={{
                fontStyle: "italic",
                fontSize: "0.9rem",
                marginTop: "20px",
              }}
            >
              No messages available at the moment.
            </p>
          )}
        </div>
        <div className="text-center mt-4">
          <p
            className="text-muted"
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.5px",
            }}
          >
            Redirecting you shortly...
          </p>
          {/* <p>{jsonData.body.face_reckoginiton_result.SessionId}</p> */}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;








