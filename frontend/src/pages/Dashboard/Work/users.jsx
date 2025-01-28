import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosinstance';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error("Failed to fetch user details.");
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchUsers();
  }, []); 

  console.log(users); 

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Users List</h1>
      <div className="flex flex-col gap-3">
        {users.length === 0 ? (
          <p>Loading users...</p>
        ) : (
          users.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-md">
              <span className="text-lg font-medium">{user.fullName}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
