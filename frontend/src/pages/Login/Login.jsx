import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import PasswordInput from "../../Components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosinstance";

const Login = () => {
  const [step, setStep] = useState(1); // Step 1: Email/Password | Step 2: OTP Verification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for better UX
  const navigate = useNavigate();

  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/send-login-otp", { email, password });
      if (response.data.error) {
        setError(response.data.message);
      } else {
        setStep(2);
      }
    } catch (error) {
      alert("Invalid Credentials!!");
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verifying OTP and redirecting to respective dashboards
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/verify-login-otp", { email, otp });
      if (response.data.error) {
        setError(response.data.message);
      } else {
        localStorage.setItem("token", response.data.accessToken);

        // Redirect based on user category
        const { category } = response.data.user;
        if (category === "Student") {
          navigate("/student-dashboard"); // Navigate to student dashboard
        } else if (category === "Instructor") {
          navigate("/instructor-dashboard"); // Navigate to instructor dashboard
        } else if (category === "Admin") {
          navigate("/admin-dashboard"); // Navigate to admin dashboard
        } else {
          setError("Unknown user category.");
        }
      }
    } catch (error) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10 shadow-lg">
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <h4 className="text-2xl font-bold mb-7 text-center">Login</h4>
              <input
                type="text"
                placeholder="Email"
                className="input-box mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button type="submit" className="btn-primary w-full mt-4" disabled={isLoading}>
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
              {/* <p className="text-sm text-center mt-4">
                Not Registered?{" "}
                <Link to="/signup" className="font-medium text-primary underline">
                  Create an Account
                </Link>
              </p> */}
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <h4 className="text-2xl font-bold mb-7 text-center">Verify OTP</h4>
              <input
                type="text"
                placeholder="Enter OTP"
                className="input-box mb-4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button type="submit" className="btn-primary w-full mt-4" disabled={isLoading}>
                {isLoading ? "Verifying OTP..." : "Verify and Login"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
