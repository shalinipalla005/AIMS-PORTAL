import React from "react";
import AuthenticatedRoute from "../../Components/AuthenticatedRoute";
import { Link } from "react-router-dom";
import Table from "../../Components/Table";

const StudentDashboard = () => {
  return (
    <AuthenticatedRoute category="Student">
      <div className="min-h-screen bg-gray-100 p-8">
        <Table />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Enroll New Course Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Enroll in a New Course</h2>
            <p className="text-gray-600 mb-4">Browse through available courses and enroll in new learning opportunities.</p>
            <Link
              to="/enroll-course"
              className="text-white bg-black py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
            >
              Browse Courses
            </Link>
          </div>

          {/* My Courses Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Your Enrolled Courses</h2>
            <p className="text-gray-600 mb-4">View and manage the courses you're currently enrolled in.</p>
            <Link
              to="/enrolled-courses"
              className="text-white bg-black py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
            >
              View My Courses
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedRoute>
  );
};

export default StudentDashboard;
