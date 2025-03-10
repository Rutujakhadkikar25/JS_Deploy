import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function RecordAttendance() {
  const [jwtToken, setJwtToken] = useState("");
  const [attendance, setAttendance] = useState({
    employeeId: "",
    date: "",
    checkInTime: "",
  });
  const [isForceCheckin, setIsForceCheckin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("Unauthorized access. Please log in.");
      navigate("/");
    } else {
      setJwtToken(token);
    }
  }, [navigate]);

  useEffect(() => {
    const employeeId = localStorage.getItem("username");
    if (!employeeId) {
      toast.error("No employee ID found. Please log in.");
      navigate("/");
    }

    const currentDate = new Date();
    const currentTime = currentDate.toTimeString().split(" ")[0];

    setAttendance({
      employeeId: employeeId,
      date: currentDate.toISOString().split("T")[0],
      checkInTime: currentTime,
    });

    const intervalId = setInterval(() => {
      const now = new Date();
      setAttendance((prev) => ({
        ...prev,
        checkInTime: now.toTimeString().split(" ")[0],
      }));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleSubmit = (e, forceCheckin) => {
    e.preventDefault();
    setIsForceCheckin(forceCheckin);
    localStorage.setItem("attendanceData", JSON.stringify(attendance)); // Store data in localStorage
    navigate("/faceliveness", { state: { jwtToken, source: "RecordAttendance", forceFlag: forceCheckin } });
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully.");
    navigate("/");
  };

  const handleCheckout = () => {
    navigate("/checkoutPage");
  };

  return (
    <div id="form-body" className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 rounded shadow-sm" style={{ width: "100%", maxWidth: "500px", backgroundColor: "#f8f9fa" }}>
        <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "12px", border: "1px solid #ddd" }}>
          <h2 className="text-center mb-4">Attendance Record</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="employeeId" className="form-label">Employee ID:</label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={attendance.employeeId}
                readOnly
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={attendance.date}
                readOnly
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="checkInTime" className="form-label">Check In Time:</label>
              <input
                type="text"
                id="checkInTime"
                name="checkInTime"
                value={attendance.checkInTime}
                readOnly
                className="form-control"
              />
            </div>
            <div className="d-flex justify-content-between mb-3">
              <button
                type="button"
                className="btn btn-primary custom-btn"
                onClick={(e) => handleSubmit(e, false)}
              >
                Check In
              </button>
              <button
                type="button"
                className="btn btn-danger custom-btn"
                onClick={(e) => handleSubmit(e, true)}
              >
                Force Check In
              </button>
            </div>
          </form>
          <ToastContainer />
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-outline-danger w-48 custom-btn"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              className="btn btn-outline-secondary w-48 custom-btn"
            >
              Go to Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordAttendance;






