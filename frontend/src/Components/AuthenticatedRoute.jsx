import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";
import Navbar from "../Components/Navbar";

const AuthenticatedRoute = ({ category, children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/get-user");
        if (response.data && response.data.user) {
          if (response.data.user.category === category) {
            setUserInfo(response.data.user);
          } else {
            alert("Unauthorized access");
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [category, navigate]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Navbar userInfo={userInfo} />
      {children}
    </>
  );
};

export default AuthenticatedRoute;
