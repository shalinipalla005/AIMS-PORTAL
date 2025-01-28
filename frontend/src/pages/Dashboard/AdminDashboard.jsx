import React from "react";
import AuthenticatedRoute from "../../Components/AuthenticatedRoute";
import { Link } from "react-router-dom";
import Table from "../../Components/Table";

const AdminDashboard = () => {
  return (
    <AuthenticatedRoute category="Admin">
      <div className="min-h-screen bg-gray-100 p-8">
        <Table />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add a New Course</h2>
            <p className="text-gray-600 mb-4">Create and manage courses for instructors to offer.</p>
            <Link
              to="/add-course"
              className="text-white bg-black py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
            >
              Add a Course
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Users</h2>
            <p className="text-gray-600 mb-4">View and manage the instructors, students, and admins.</p>
            <Link
              to="/manage-users"
              className="text-white bg-black py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
            >
              Manage Users
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedRoute>
  );
};

export default AdminDashboard;
