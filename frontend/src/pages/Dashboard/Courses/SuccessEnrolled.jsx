import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosinstance";
import AuthenticatedRoute from "../../../Components/AuthenticatedRoute";

const SuccessEnrolled = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructors, setInstructors] = useState({}); // State to store instructor details
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6; // Number of courses per page
  const navigate = useNavigate();

  const fetchInstructorName = async (instructorId) => {
    try {
      const response = await axiosInstance.get(`/view-user/${instructorId}`);
      if (response.data && !response.data.error) {
        setInstructors((prevInstructors) => ({
          ...prevInstructors,
          [instructorId]: response.data.userDetails.fullName, // Store instructor name
        }));
      }
    } catch (error) {
      console.error("Error fetching instructor details:", error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axiosInstance.get("/enrolled-courses");
      if (response.data && !response.data.error) {
        setEnrolledCourses(response.data.enrolledCourses);

        // Fetch instructor names for all courses
        response.data.enrolledCourses.forEach((course) => {
          fetchInstructorName(course.instructor);
        });
      } else {
        console.error(response.data.message || "Failed to fetch courses.");
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // Calculate indices for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = enrolledCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(enrolledCourses.length / coursesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <AuthenticatedRoute category="Student">
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Enrolled Courses</h1>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 transition-all"
          >
            Go to Dashboard
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <p className="text-center text-gray-600">
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {currentCourses.map((course, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    <strong>Course ID:</strong> {course.courseCode}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Instructor:</strong>{" "}
                    {instructors[course.instructor] || "Loading..."} {/* Display instructor name */}
                  </p>
                  <p
                    className={`font-semibold mb-2 ${course.status === "Pending"
                      ? "text-yellow-600"
                      : course.status === "Pending for FA"
                        ? "text-orange-600"
                        : course.status === "Rejected"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                  >
                    <strong>Status:</strong> {course.status}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2 hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-gray-700 mx-4">
                Page {currentPage} of {totalPages}
              </p>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-500 text-white rounded ml-2 hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </AuthenticatedRoute>
  );
};

export default SuccessEnrolled;
