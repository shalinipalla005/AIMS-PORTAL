import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AuthenticatedRoute from "../../../Components/AuthenticatedRoute";

const ManageUsers = () => {
    return (
        <AuthenticatedRoute category="Admin">
            <div className="min-h-screen bg-gray-100 p-8">

                <h1 className="text-center text-4xl font-bold mb-6 text-gray-800">
                    Manage Users
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
                    {/* Add User Card */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add a New User</h2>
                        <p className="text-gray-600 mb-4">
                            Create a new user by entering their details like name, email, and password.
                        </p>
                        <Link
                            to="/add-user"
                            className="text-white bg-black py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
                        >
                            Add User
                        </Link>
                    </div>

                    {/* View All Users Card */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">View All Users</h2>
                        <p className="text-gray-600 mb-4">
                            See a list of all registered users, including their roles and details.
                        </p>
                        <Link
                            to="/all-users"
                            className="text-white bg-black py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
                        >
                            View Users
                        </Link>
                    </div>
                </div>
                {/* Button to Navigate to Dashboard */}
                <div className="flex justify-center mt-8">
                    <Link
                        to="/admin-dashboard"
                        className="text-white bg-black py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </AuthenticatedRoute>
    );
};

export default ManageUsers;
