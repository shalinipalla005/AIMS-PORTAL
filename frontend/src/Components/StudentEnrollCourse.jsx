import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentEnrollCourse = () => {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch available courses
        axios.get("/available-courses", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
            setCourses(response.data.courses);
        })
        .catch((error) => {
            console.error("Error fetching courses:", error);
        });
    }, []);

    const handleEnroll = (courseId) => {
        // Enroll in a course
        axios.post(
            "/enroll-course",
            { courseId },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        )
        .then((response) => {
            setMessage(response.data.message);
        })
        .catch((error) => {
            console.error("Error enrolling in course:", error);
            setMessage("Failed to enroll in the course");
        });
    };

    return (
        <div>
            <h1>Available Courses</h1>
            {message && <p>{message}</p>}
            <ul>
                {courses.map((course) => (
                    <li key={course._id}>
                        <strong>{course.title}</strong> - {course.courseCode}
                        <button onClick={() => handleEnroll(course._id)}>Enroll</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentEnrollCourse;
