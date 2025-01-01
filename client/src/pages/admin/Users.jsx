import React, { useEffect, useState } from "react";
import axios from 'axios';
import { showToast } from '../../helper/toast.js';
import { showBlockConfirmation } from "../../helper/Sweat.js";
import { toast } from "react-toastify";

const Users = () => {
  const [userData, setUserData] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/get_all_users');
      if (response.status === 200) {
        setUserData(response.data);
      } else {
        showToast(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (id, currentStatus) => {
    const newStatus = currentStatus === true ? false : true;

    const title = `Do you want to ${newStatus ? 'Unblock' : 'Block'} the user?`;

    showBlockConfirmation(title, newStatus, async () => {
      try {
        await axios.put('http://localhost:3000/admin/block_user', { id, status: newStatus });

        fetchUsers();
        toast.success(`User has been ${newStatus ? 'unblocked' : 'blocked'}`);
      } catch (error) {
        console.error('Error blocking/unblocking user:', error);
        toast.error('Failed to update user status');
      }
    }, () => {
      console.log('Action canceled');
    });
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-5xl tracking-wider Header">Users List</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-center text-sm">
          <thead className="bg-[#292929] uppercase pop tracking-wider">
            <tr>
              <th className="p-4">profile</th>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Registered On</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {userData && userData.length > 0 ? (
              userData.map((user, index) => (
                <tr key={index} className="border-y-4 border-black bg-[#2423238d]">
                  <td className="p-4">
                    <img
                      src={user.profilePicture || "https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"}
                      alt="Profile"
                      className="w-14 h-14 rounded-sm object-contain"
                    />
                  </td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-8 py-2 font-semibold uppercase ${
                        user.status === true
                          ? "text-white bg-green-600"
                          : "text-white bg-red-600"
                      }`}
                    >
                      {user.status === true ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      className={`px-8 py-3 text-[white] font-medium rounded-sm  ${
                        user.status === true
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                      title="Block User"
                      onClick={() => handleBlock(user._id, user.status)}
                    >
                      {user.status === true ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
