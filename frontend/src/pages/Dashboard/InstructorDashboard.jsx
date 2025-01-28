import React, { useEffect, useState } from "react";
import AuthenticatedRoute from "../../Components/AuthenticatedRoute";
import { Link } from "react-router-dom";
import Table from "../../Components/Table";
import axiosInstance from "../../utils/axiosinstance";

const DashboardCard = ({ title, description, link, linkText, bgColor }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link to={link} className={`text-white ${bgColor} py-2 px-4 rounded-lg hover:opacity-90 transition-all`}>
      {linkText}
    </Link>
  </div>
);

const InstructorDashboard = () => {
  const [isFa, setIsFA] = useState(false);

  const userInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
         console.log(response.data);
      if(response.data&&response.data.user.fa){
        setIsFA(true);
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error.message || error);
    }
  };
  

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <AuthenticatedRoute category="Instructor">
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-center text-4xl font-bold mb-6 text-gray-800">Instructor Dashboard</h1>
        <Table />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <DashboardCard
            title="My Courses"
            description="View and manage the courses you’ve created."
            link="/my-courses"
            linkText="View Courses"
            bgColor="bg-gray-600"
          />
          <DashboardCard
            title="Your Students"
            description="Verify and manage your students' status."
            link="/verify-students"
            linkText="Validate Status"
            bgColor="bg-gray-600"
          />
          {isFa && (
            <DashboardCard
              title="Requests for FA"
              description="Manage course enrollment requests for your department."
              link="/verify-fa"
              linkText="View Requests"
              bgColor="bg-gray-600"
            />
          )}
        </div>
      </div>
    </AuthenticatedRoute>
  );
};

export default InstructorDashboard;
