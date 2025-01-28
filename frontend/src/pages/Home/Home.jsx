import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import StudentDashboard from "../../pages/Dashboard/StudentDashboard";
import InstructorDashboard from "../../pages/Dashboard/InstructorDashboard";
import AdminDashboard from "../../pages/Dashboard/AdminDashboard";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Search note function
  const onSearchNote = (query) => {
    console.log("Search query:", query);
    // Implement your search functionality here
  };

  // Clear search function
  const handleClearSearch = () => {
    console.log("Search cleared");
    // Implement your clear search functionality here
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // Render appropriate dashboard based on user category
  const renderDashboard = () => {
    if (!userInfo) {
      return <h2>Loading...</h2>;
    }

    switch (userInfo.category) {
      case "Student":
        return <StudentDashboard />;
      case "Instructor":
        return <InstructorDashboard />;
      case "Admin":
        return <AdminDashboard />;
      default:
        return <h2>Invalid user category</h2>;
    }
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
      />
      <div>
        {renderDashboard()}
      </div>
    </>
  );
};

export default Home;

// import React, { useEffect, useState } from "react";
// import Navbar from "../../Components/Navbar";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosinstance";
// import StudentDashboard from "../../pages/Dashboard/StudentDashboard";
// import InstructorDashboard from "../../pages/Dashboard/InstructorDashboard";
// import AdminDashboard from "../../pages/Dashboard/AdminDashboard";

// const Home = () => {
//   const [userInfo, setUserInfo] = useState(null);
//   const navigate = useNavigate();

//   // Get User Info
//   const getUserInfo = async () => {
//     try {
//       const response = await axiosInstance.get("/get-user");
//       if (response.data && response.data.user) {
//         setUserInfo(response.data.user);
//       }
//     } catch (error) {
//       if (error.response.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };

//   // Search note function
//   const onSearchNote = (query) => {
//     console.log("Search query:", query);
//     // Implement your search functionality here
//   };

//   // Clear search function
//   const handleClearSearch = () => {
//     console.log("Search cleared");
//     // Implement your clear search functionality here
//   };

//   useEffect(() => {
//     getUserInfo();
//   }, []);

//   return (
//     <>
//       <Navbar
//         userInfo={userInfo}
//         onSearchNote={onSearchNote}
//         handleClearSearch={handleClearSearch}
//       />
//       <div>
//         <h1>Welcome to Home page</h1>
//       </div>
//     </>
//   );
// };

// export default Home;
