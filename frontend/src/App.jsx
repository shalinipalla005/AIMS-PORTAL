import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import InstructorDashboard from "./pages/Dashboard/InstructorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import AddCourse from "./pages/Dashboard/Courses/AddCourse";
import EnrollCourse from "./pages/Dashboard/Courses/EnrollCourse";
import SuccessEnrolled from "./pages/Dashboard/Courses/SuccessEnrolled";
import CourseValidation from "./pages/Dashboard/Work/CourseValidation";
import MyCourses from "./pages/Dashboard/Work/Mycourses";
import Favalidation from "./pages/Dashboard/Work/faValidation";
import CourseStudents from "./pages/Dashboard/Work/CourseStudents";
import Users from "./pages/Dashboard/Work/users";
import ManageUsers from './pages/Dashboard/Courses/ManageUsers';
import AddUser from "./pages/Dashboard/Admin/AddUsers";
import AllUsers from "./pages/Dashboard/Admin/AllUsers";
import ViewUser from "./pages/Dashboard/Admin/ViewUser";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" exact element={<SignUp />} />
        <Route path="/student-dashboard" exact element={<StudentDashboard />} />
        <Route path="/instructor-dashboard" exact element={<InstructorDashboard />} />
        <Route path="/admin-dashboard" exact element={<AdminDashboard />} />
        {/* Admin */}
        <Route path="/add-course" exact element={<AddCourse />} />
        <Route path="/manage-users" exact element={<ManageUsers />} />
        <Route path="/add-user" exact element={<AddUser />} />
        <Route path="/all-users" exact element={<AllUsers />} />
        <Route path="/view-user/:id" exact element={<ViewUser />} />
        {/* Student */}
        <Route path="/manage-users" exact element={<Users />} />
        <Route path="/enroll-course" exact element={<EnrollCourse />} />
        <Route path="/enrolled-courses" exact element={<SuccessEnrolled />} />
        {/* Instructor */}
        <Route path="/verify-students" exact element={<CourseValidation />} />
        <Route path="/my-courses" exact element={<MyCourses />} />
        <Route path="/students" element={<CourseStudents />} />
        <Route path="/verify-fa" element={<Favalidation />} />

      </Routes>
    </Router>
  );
};

export default App;
