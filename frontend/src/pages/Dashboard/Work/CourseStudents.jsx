import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CourseStudents = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { courseCode = "N/A", courseName = "N/A" } = location.state || {};
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
      console.log(courseCode);
    const fetchStudents = async () => {
        try {
            const host = "http://localhost:8000";
            const accessToken = localStorage.getItem("token");
            if (!accessToken) {
                alert("Unauthorized! Please log in again.");
                navigate("/login");
                return;
            }
            const response = await fetch(`${host}/FetchStudents/${courseCode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${accessToken}`,
                },
            });

            const json = await response.json();
            console.log("Students API Response:", json);
            
            if (response.ok) {
                const enrolledStudents = json.students[0]?.enrolledStudents || [];
                if (enrolledStudents.length > 0) {
                    setStudents(enrolledStudents);
                } else {
                    setError("No students enrolled in this course.");
                }
            } else {
                setError(json.msg || "Failed to fetch students.");
            }
        } catch (e) {
            console.error("Error fetching students:", e);
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
      const filtered=students.filter((student)=>student.status==="Approved");
    useEffect(() => {
        if (!courseCode) {
            navigate("/my-courses");
        } else {
            fetchStudents();
        }
    }, [courseCode]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-lg text-gray-600">Loading students...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <button
                        onClick={() => navigate("/my-courses")}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Students Enrolled in {courseName}</h1>
            <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td
                                className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                                colSpan="2"
                            >
                                No students enrolled
                            </td>
                        </tr>
                    ) : (
                        filtered.map((student, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="mt-6">
                <button
                    onClick={() => navigate("/my-courses")}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all"
                >
                    Back to Courses
                </button>
            </div>
        </div>
    );
};

export default CourseStudents;
