import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import AuthenticatedRoute from "../../../Components/AuthenticatedRoute";
import { useNavigate } from "react-router-dom";

const CourseValidation = () => {
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const coursesPerPage = 3; // Number of courses to show per page
  const navigate = useNavigate();

  const fetchPendingEnrollments = async () => {
    try {
      const response = await axiosInstance.get("/getApproved");
      if (response.data && !response.data.error) {
        // Filter out courses with no pending students
        const filteredEnrollments = response.data.pendingEnrollments.filter(
          (course) => course.pendingStudents.length > 0
        );
        setPendingEnrollments(filteredEnrollments);
      } else {
        console.error("Failed to fetch pending enrollments.");
      }
    } catch (error) {
      console.error("Error fetching pending enrollments:", error);
    }
  };

  const handleUpdateStatus = async (courseId, studentId, status, faculty) => {
    try {
      const response = await axiosInstance.post("/UpdateStatus", {
        faculty,
        courseId,
        studentId,
        status,
      });
      console.log(response.data);
      if (response.data && !response.data.error) {
        alert(response.data.message);
        fetchPendingEnrollments(); // Refresh the data
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPendingEnrollments();
  }, []);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = pendingEnrollments.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(pendingEnrollments.length / coursesPerPage);

  return (
    <AuthenticatedRoute category="Instructor">
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col justify-around">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Validate Enrollment Requests
          </h1>

          {currentCourses.length === 0 ? (
            <p className="text-center text-gray-600">
              No pending enrollment requests at the moment.
            </p>
          ) : (
            <div className="space-y-8">
              {currentCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    FA Approval required for {course.courseTitle} (
                    {course.courseCode})
                  </h2>
                  <div className="space-y-4">
                    {course.pendingStudents.map((student) => (
                      <div
                        key={student.studentId}
                        className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
                      >
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            {student.name}
                          </p>
                          <p className="text-gray-600">{student.email}</p>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                course.courseId,
                                student.studentId,
                                "Approved",
                                student.faculty
                              )
                            }
                            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                course.courseId,
                                student.studentId,
                                "Rejected",
                                null
                              )
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-white rounded border">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate("/instructor-dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all mt-8"
        >
          Go Back to Dashboard
        </button>
      </div>
    </AuthenticatedRoute>
  );
};

export default CourseValidation;
