import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosinstance";
import AuthenticatedRoute from "../../../Components/AuthenticatedRoute";

const ViewUser = () => {
    const { id } = useParams(); // Get user ID from the URL
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(`/view-user/${id}`);
                if (response.data && !response.data.error) {
                    setUser(response.data.userDetails);
                }
            } catch (error) {
                setError("Failed to fetch user details.");
                console.error("Error fetching user details:", error);
            }
        };

        fetchUser();
    }, [id]);


    return (
        <AuthenticatedRoute category="Admin">
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-2xl">
                    {/* Back Button */}
                    <div className="mb-4">
                        <Link
                            to="/all-users"
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all"
                        >
                            Go Back to All Users
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">User Details</h1>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    {user ? (
                        <div>
                            <p><strong>Full Name:</strong> {user.fullName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Category:</strong> {user.category}</p>
                            <p><strong>Department:</strong> {user.department}</p>
                            {user.category === "Instructor" && user.fa && (
                                <p><strong>FA:</strong> True</p>
                            )}

                            <p><strong>Created At:</strong> {new Date(user.createdOn).toLocaleString()}</p>
                        </div>
                    ) : (
                        <p>Loading user details...</p>
                    )}
                </div>
            </div>
        </AuthenticatedRoute>
    );
};

export default ViewUser;
