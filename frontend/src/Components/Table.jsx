import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosinstance';
import { getInitials } from '../utils/helper';

const DynamicTable = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/get-user');
        if (response.data && response.data.user) {
          setData(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <h2 className="text-center text-lg font-semibold text-gray-600 mt-8">Loading...</h2>;
  }

  const excludedFields = ['createdOn', '_id', "__v", "password"];

  const formatKey = (key) => {
    return key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="p-6 bg-black rounded-lg shadow-md mx-4 my-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">{data.category} Details</h2>
      <table className="min-w-full table-auto text-black">
        <tbody>
          {Object.entries(data)
            .filter(([key]) => !excludedFields.includes(key) && (data.category === 'Instructor' || key !== 'fa'))
            .map(([key, value], index) => (
              <tr
                key={index}
                className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="px-4 py-2 font-semibold">{formatKey(key)}</td>
                <td className="px-4 py-2">
                  {key === 'name' && value && getInitials(value)}
                  {key === 'fa' ? (
                    value ? 'Yes' : 'No'
                  ) : (
                    key !== 'name' && value
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
