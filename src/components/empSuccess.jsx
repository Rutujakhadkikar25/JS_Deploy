
import { useNavigate } from "react-router-dom";

export default function EmployeeSuccess() {
  const navigate = useNavigate();
  const handleRecordAttendance = () => { 
      navigate("/recordAttendance"); 
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1>Welcome to the Attendance Marking Page</h1>
      <p>Please click the button below to record your attendance</p>
      <button onClick={handleRecordAttendance} className="btn btn-primary mt-3">
        Record Attendance
      </button>
    </div>
  );
}
