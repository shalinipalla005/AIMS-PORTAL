import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosinstance";
import AuthenticatedRoute from "../../../Components/AuthenticatedRoute";

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(6); // Number of users per page

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get("/all-users");
                if (response.data && !response.data.error) {
                    setUsers(response.data.users);
                    setFilteredUsers(response.data.users);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
        filterUsers(query, selectedCategory);
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        filterUsers(search, category);
    };

    const filterUsers = (searchQuery, category) => {
        let filtered = users.filter((user) => {
            const isCategoryMatch =
                category === "All Categories" || user.category === category;
            const isSearchMatch =
                user.fullName.toLowerCase().includes(searchQuery) ||
                user.email.toLowerCase().includes(searchQuery);
            return isCategoryMatch && isSearchMatch;
        });
        setFilteredUsers(filtered);
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <AuthenticatedRoute category="Admin">
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-5xl">

                    <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
                        All Users
                    </h1>

                    {/* Search and Filter */}
                    <div className="flex justify-between items-center mb-6">
                        {/* Search Input */}
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search by name or email"
                                className="border py-2 px-4 rounded-lg w-64"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center">
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="border py-2 px-4 rounded-lg"
                            >
                                <option>All Categories</option>
                                <option>Admin</option>
                                <option>Instructor</option>
                                <option>Student</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6">Name</th>
                                    <th className="py-3 px-6">Email</th>
                                    <th className="py-3 px-6">Category</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {currentUsers.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="border-b border-gray-200 hover:bg-gray-100"
                                    >
                                        <td className="py-3 px-6 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="font-medium">{user.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span>{user.email}</span>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span>{user.category}</span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <Link
                                                to={`/view-user/${user._id}`}
                                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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

                    <div className="flex justify-center mt-8">
                        <Link
                            to="/manage-users"
                            className="text-white bg-black py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
                        >
                            Back to Manage Users
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedRoute>
    );
};

export default AllUsers;
