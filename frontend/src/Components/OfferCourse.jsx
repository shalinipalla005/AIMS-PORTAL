import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosinstance";

const OfferCourse = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/courses");
      if (response.data.error) {
        setError(response.data.message);
      } else {
        setCourses(response.data.courses);
      }
    } catch (error) {
      setError("Failed to fetch courses. Please try again.");
    }
  };

  const handleOfferCourse = async (courseId) => {
    try {
      await axiosInstance.post("/offer-course", { courseId });
      alert("Course successfully offered!");
      fetchCourses(); // Refresh the list
    } catch (error) {
      setError("Failed to offer course. Please try again.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h3>Offer a Course</h3>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        {courses.map((course) => (
          <div key={course._id}>
            <h4>{course.title}</h4>
            <button onClick={() => handleOfferCourse(course._id)}>
              Offer Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferCourse;
