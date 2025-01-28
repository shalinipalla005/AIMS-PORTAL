import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import AuthenticatedRoute from "../../../Components/AuthenticatedRoute";
import { useNavigate } from "react-router-dom";

const CourseValidation = () => {
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(3);
  const navigate = useNavigate();

  const fetchPendingEnrollments = async () => {
    try {
      const response = await axiosInstance.get("/instructor/pending-enrollments");
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

  const handleUpdateStatus = async (courseId, studentId, status) => {
    try {
      const response = await axiosInstance.post("/instructor/update-enrollment", {
        courseId,
        studentId,
        status,
      });
      if (response.data && !response.data.error) {
        alert(response.data.message);
        fetchPendingEnrollments();
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

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = pendingEnrollments.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(pendingEnrollments.length / coursesPerPage);

  return (
    <AuthenticatedRoute category="Instructor">
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col justify-around">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Validate Enrollment Requests
          </h1>

          {pendingEnrollments.length === 0 ? (
            <p className="text-center text-gray-600">
              No pending enrollment requests at the moment.
            </p>
          ) : (
            <div className="space-y-8">
              {currentCourses.map((course) => (
                <div key={course.courseId} className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {course.courseTitle} ({course.courseCode})
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
                              handleUpdateStatus(course.courseId, student.studentId, "Pending for FA")
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(course.courseId, student.studentId, "Rejected")
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
        </div>

        {/* Pagination Controls */}
        {pendingEnrollments.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-black text-white rounded mr-2 hover:bg-gray-800 disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-gray-700 mx-2">Page {currentPage} of {totalPages}</p>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-black text-white rounded ml-2 hover:bg-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate("/instructor-dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all mt-4"
        >
          Go Back to Dashboard
        </button>
      </div>
    </AuthenticatedRoute>
  );
};

export default CourseValidation;
