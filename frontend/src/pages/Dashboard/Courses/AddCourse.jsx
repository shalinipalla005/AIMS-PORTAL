import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { useNavigate } from "react-router-dom";
import AuthenticatedRoute from "../../../Components/AuthenticatedRoute";

const AddCourse = () => {
  const [form, setForm] = useState({
    title: "",
    courseCode: "",
    instructor: "",
    Credits: "",
  });
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State for popup
  const navigate = useNavigate();

  // Fetch instructors list on component mount
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axiosInstance.get("/instructors");
        if (response.data && !response.data.error) {
          setInstructors(response.data.instructors);
        } else {
          console.error("Failed to fetch instructors");
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/add-course", form);

      if (response.data && response.data.course) {
        setShowPopup(true); // Show popup on success
        setForm({
          title: "",
          courseCode: "",
          instructor: "",
          Credits: "",
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message || "Error");
      }
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/admin-dashboard"); // Redirect after closing the popup
  };

  return (
    <AuthenticatedRoute category="Admin">
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add a New Course</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Course Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Enter course title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Course Code</label>
            <input
              type="text"
              name="courseCode"
              value={form.courseCode}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Enter course code"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Credits</label>
            <input
              type="number"
              name="Credits"
              value={form.Credits}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Enter Credits"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Instructor</label>
            <select
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor) => (
                <option
                  key={instructor._id}
                  value={instructor._id}
                  className="text-gray-900 bg-white hover:bg-blue-100"
                >
                  {instructor.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="text-white bg-black py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
            >
              Add Course
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard")}
              className="text-white bg-black py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
            >
              Go Back to Dashboard
            </button>
          </div>
        </form>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Course Added Successfully!</h2>
            <button
              onClick={closePopup}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </AuthenticatedRoute>
  );
};

export default AddCourse;
