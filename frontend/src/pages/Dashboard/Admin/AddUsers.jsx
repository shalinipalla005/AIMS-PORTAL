import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { useNavigate, Link } from "react-router-dom";
import AuthenticatedRoute from "../../../Components/AuthenticatedRoute";

const AddUser = () => {
    const [user, setUser] = useState({
        fullName: "",
        email: "",
        password: "",
        category: "",
        department: "",
        fa: false, // Faculty Advisor checkbox
    });
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false); // State for popup
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser({
            ...user,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/add-user", user);
            if (response.data && !response.data.error) {
                setShowPopup(true); // Show popup on success
                // Reset form
                setUser({
                    fullName: "",
                    email: "",
                    password: "",
                    category: "",
                    department: "",
                    fa: false,
                });
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to add user.");
            }
            setTimeout(() => setError(""), 3000);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        navigate("/manage-users"); // Redirect after closing popup
    };

    return (
        <AuthenticatedRoute category="Admin">
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Add User</h1>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={user.fullName}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter full name"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter email"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter password"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Category</label>
                            <select
                                name="category"
                                value={user.category}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="" disabled>
                                    Choose a role
                                </option>
                                <option value="Admin">Admin</option>
                                <option value="Instructor">Instructor</option>
                                <option value="Student">Student</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700">Department</label>
                            <select
                                name="department"
                                value={user.department}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md"
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

                        {user.category === "Instructor" && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="fa"
                                    checked={user.fa}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label className="text-gray-700">Are you a Faculty Advisor?</label>
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                            >
                                Create User
                            </button>
                            <Link
                                to="/manage-users"
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all"
                            >
                                Back to Manage Users
                            </Link>
                        </div>
                    </form>
                </div>
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h2 className="text-2xl font-bold text-green-600 mb-4">User Created Successfully!</h2>
                            <button
                                onClick={closePopup}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedRoute>
    );
};

export default AddUser;
