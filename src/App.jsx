import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";

import "./App.css";
// import Start from './components/start';
import "react-toastify/dist/ReactToastify.css";
import EmployeeSuccess from "./components/empSuccess";
import RecordAttendance from "./components/attendanceRecord";
import EmployeeLogin from "./components/empLogin";
import FaceLivenessPage from "./components/FaceLivenessPage";
import RecordCheckout from "./components/checkoutAttendance";
import MessagesPage from "./components/MessagesPage";
import FaceLivenessResult from "./components/FaceLivenessResult";

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path='/' element={<Start />} /> */}
          <Route path="/" element={<EmployeeLogin />} />
          <Route path="/employeedetail" element={<EmployeeSuccess />} />
          <Route path="/recordAttendance" element={<RecordAttendance />} />
          <Route path="/checkoutPage" element={<RecordCheckout />} />
          <Route path="/faceliveness" element={<FaceLivenessPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/results" element={<FaceLivenessResult/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
