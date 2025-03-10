import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/employeeLogin.css";

function EmployeeLogin() {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log(apiUrl,'apiurl')
    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!values.username || !values.password) {
            toast.error("Username and password are required.");
            return;
        }

        // Convert the values to URL-encoded format
        const formData = qs.stringify({
            username: values.username,
            password: values.password
        });

        // Set content type to 'application/x-www-form-urlencoded'
        axios.post(`${apiUrl}/api/authorize`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(result => {
            if (result.data.token) {
                // Store token and user details in localStorage
                localStorage.setItem('jwtToken', result.data.token);
                localStorage.setItem('username', result.data.username);
                localStorage.setItem('roles', result.data.roles);

                // Redirect to employee detail page
                navigate('/employeedetail');
                toast.success("Login successful");
            } else {
                toast.error("Invalid username or password.");
            }
        })
        .catch(err => {
            // Handle various error cases
            if (err.response) {
                if (err.response.status === 401) {
                    toast.error("Invalid username or password.");
                } else if (err.response.status === 403) {
                    toast.error("You do not have access.");
                } else {
                    toast.error("An error occurred: " + err.response.statusText);
                }
            } else {
                toast.error("Unable to connect to the server.");
            }
        });
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="attendance-login-page">
            <div className="attendance-login-wrapper">
                <div className="attendance-login-content">
                    <h1 className="attendance-title">Attendance System</h1>
                    
                    <div className="logo-wrapper">
                        <div className="logo-circle">
                            {/* Company logo */}
                            <img 
                                src="/public/devdolphinsLogo.jpg" 
                                alt="Dolphin Logo" 
                                className="logo-image"
                            />
                        </div>
                    </div>
                    
                    <div className="login-form-wrapper">
                        <form onSubmit={handleSubmit}>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control custom-input"
                                    placeholder="enter email"
                                    name="username"
                                    value={values.username}
                                    onChange={handleInputChange}
                                    aria-label="Email"
                                />
                                <span className="input-group-text custom-input-icon">
                                    {/* User icon as shown in Figma design */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z"/>
                                    </svg>
                                </span>
                            </div>
                            
                            <div className="input-group mb-4">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control custom-input"
                                    placeholder="enter password"
                                    name="password"
                                    value={values.password}
                                    onChange={handleInputChange}
                                    aria-label="Password"
                                />
                                <span 
                                    className="input-group-text custom-input-icon"
                                    onClick={togglePasswordVisibility}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* Eye icon that toggles between visible and hidden */}
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8c-.058.087-.122.183-.195.288a13 13 0 0 1-.131.195 9 9 0 0 1-.491.592 11 11 0 0 1-2.417 1.958 9.5 9.5 0 0 1-2.305.985 6.5 6.5 0 0 1-.43.078 6 6 0 0 1-.443.044l.206.206c.146-.027.29-.059.428-.096a8.5 8.5 0 0 0 2.042-.879 10 10 0 0 0 2.203-1.77c.166-.182.32-.369.455-.56z"/>
                                            <path d="M10.121 12.596A8 8 0 0 1 8.5 13c-2.12 0-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8a13 13 0 0 1 2.76-2.864l-1.34-1.34C.891 5.055 0 6.614 0 8s.891 2.945 2.593 4.203a9.5 9.5 0 0 0 2.593 1.726c1.93.742 3.723.802 5.164.441.466-.115.886-.271 1.258-.465l-1.487-1.31Z"/>
                                            <path d="M5.738 6.623 5.149 6.034a7 7 0 0 1 1.596-.83l.59.59a6 6 0 0 0-1.597.83"/>
                                            <path d="m11.764 9.886-.59-.59a6 6 0 0 1-1.596.83l.59.59a7 7 0 0 0 1.596-.83"/>
                                            <path d="m10.827 7.709-8.18 8.178 1.35 1.35 8.18-8.177-1.35-1.35"/>
                                        </svg>
                                    )}
                                </span>
                            </div>
                            
                            <div className="d-grid mb-3">
                                <button type="submit" className="btn custom-login-btn">
                                    Log in
                                </button>
                            </div>
                            
                            <div className="text-center">
                                <a href="#" className="forgot-password-link" onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/forgot-password');
                                }}>
                                    Forgotten Password?
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer position='bottom-right' />
        </div>
    );
}

export default EmployeeLogin;