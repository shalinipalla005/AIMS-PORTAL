import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
    const [courses, setCourses] = useState([]); 
    const [user, setUser] = useState(null);
    let accessToken = localStorage.getItem("token");
    const navigate = useNavigate();

    if (!accessToken) {
        console.error("Access token not found. Please log in.");
        return;
    }

    const fetchCourses = async () => {
        try {
            const host = "http://localhost:8000";
            const response = await fetch(`${host}/FetchCourses`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${accessToken}`,
                },
            });

            const json = await response.json();
            console.log("API Response:", json);

            if (json.courses) {
                setCourses(json.courses);
                setUser(json.user);
            } else {
                console.warn("No 'courses' key found in the API response.");
            }
        } catch (e) {
            console.error("Error fetching courses:", e);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">My Courses</h1>
            <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">Course Code</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Course Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Course Instructor</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Credits</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.length === 0 ? (
                        <tr>
                            <td
                                className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                                colSpan="5"
                            >
                                No courses available
                            </td>
                        </tr>
                    ) : (
                        courses.map((course, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">{course.courseCode}</td>
                                <td className="border border-gray-300 px-4 py-2">{course.title}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.fullName}</td>
                                <td className="border border-gray-300 px-4 py-2">{course.Credits}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all"
                                            onClick={() =>
                                            navigate("/students", { state: { courseCode: course.courseCode, courseName: course.title } })
                                        }
                                    >
                                        View Students
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <button
                    type="button"
                    onClick={() => navigate("/instructor-dashboard")}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all"
                >
                    Go Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default MyCourses;
