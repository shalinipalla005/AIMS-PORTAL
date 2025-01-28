import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosinstance';
import { Dialog } from '@headlessui/react';
import AuthenticatedRoute from '../../../Components/AuthenticatedRoute';

const EnrollCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [instructorName, setInstructorName] = useState('');
  const navigate = useNavigate();

  const getAllCourses = async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/available-courses?page=${page}&limit=10`);
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.log('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructorName = async (instructorId) => {
    try {
      const response = await axiosInstance.get(`/view-user/${instructorId}`);
      if (response.data && !response.data.error) {
        setInstructorName(response.data.userDetails.fullName);
      } else {
        setInstructorName('Unknown'); // Fallback if name is not available
      }
    } catch (error) {
      console.error('Error fetching instructor details:', error);
      setInstructorName('Unknown');
    }
  };

  useEffect(() => {
    getAllCourses(currentPage);
  }, [currentPage]);

  const handleSendRequest = async (courseId) => {
    try {
      const response = await axiosInstance.post(`/enroll-course`, { courseId });
      if (response.data && !response.data.error) {
        alert('Request sent to the instructor successfully.');
        setShowPopup(false);
        getAllCourses(currentPage); // updates available courses
      } else {
        alert(response.data.message || 'Failed to send the request.');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert(error.response?.data?.message || 'Failed to send the request. Please try again later.');
    }
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
      <div className="min-h-screen bg-gray-100 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Available Courses</h1>

        {courses.length === 0 ? (
          <p className="text-center text-gray-600">No courses available at the moment. Please check back later.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-2">Course ID: {course.courseCode}</p>
                <button
                  onClick={async () => {
                    setSelectedCourse(course);
                    await fetchInstructorName(course.instructor); // Fetch instructor name
                    setShowPopup(true);
                  }}
                  className="py-2 px-4 bg-black text-white rounded hover:bg-gray-800 transition-all"
                >
                  Send Request
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
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

        {/* Button to Navigate to Dashboard */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/student-dashboard')} // Replace with the correct path to the dashboard
            className="py-2 px-6 bg-black text-white rounded hover:bg-gray-800 transition-all"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Popup Dialog */}
        {showPopup && selectedCourse && (
          <Dialog open={showPopup} onClose={() => setShowPopup(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Send Request to Instructor</h2>
              <p className="text-gray-700 mb-2"><strong>Course:</strong> {selectedCourse.title}</p>
              <p className="text-gray-700 mb-2"><strong>Instructor:</strong> {instructorName}</p>
              <p className="text-gray-700 mb-4"><strong>Course ID:</strong> {selectedCourse.courseCode}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPopup(false)}
                  className="py-2 px-4 bg-gray-300 text-gray-800 rounded mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSendRequest(selectedCourse._id.toString())}
                  className="py-2 px-4 bg-black text-white rounded hover:bg-gray-800"
                >
                  Confirm
                </button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </AuthenticatedRoute>
  );
};

export default EnrollCourse;
