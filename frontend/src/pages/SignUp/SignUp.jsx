import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import PasswordInput from "../../Components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosinstance";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [otp, setOtp] = useState("");
  const [fa, setIsFacultyAdvisor] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Send OTP for sign-up
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!department) {
      setError("Please select a department.");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/send-otp", {
        email,
        category,
        department,
        fa,
      });

      if (response.data.error) {
        setError(response.data.message);
      } else {
        setStep(2);
      }
    } catch (error) {
      alert("User already Exists!!");
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/verify-otp", {
        email,
        otp,
        fullName: name,
        password,
        category,
        department,
        fa,
      });

      if (response.data.error) {
        setError(response.data.message);
      } else {
        localStorage.setItem("token", response.data.accessToken);

        if (category === "Student") {
          navigate("/student-dashboard");
        } else if (category === "Instructor") {
          navigate("/instructor-dashboard");
        } else if (category === "Admin") {
          navigate("/admin-dashboard");
        } else {
          setError("Invalid category.");
        }
      }
    } catch (error) {
      setError("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <h4 className="text-2xl mb-7">Sign Up</h4>
              <input
                type="text"
                placeholder="Name"
                className="input-box"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Select Role</label>
                <select
                  className="input-box"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Choose a role
                  </option>
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Select Department</label>
                <select
                  className="input-box"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="" disabled>
                    Choose a department
                  </option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {category === "Instructor" && (
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">Are you a Faculty Advisor?</label>
                  <input
                    type="checkbox"
                    className="input-box"
                    checked={fa}
                    onChange={(e) => setIsFacultyAdvisor(e.target.checked)}
                  />
                </div>
              )}
              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              <button type="submit" className="btn-primary">
                Send OTP
              </button>
              <p className="text-sm text-center mt-4">
                Already a user?{" "}
                <Link to="/login" className="font-medium text-primary underline">
                  Login
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <h4 className="text-2xl mb-7">Verify OTP</h4>
              <input
                type="text"
                placeholder="Enter OTP"
                className="input-box"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              <button type="submit" className="btn-primary">
                Verify and Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUp;
