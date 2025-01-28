import React from 'react';
import { getInitials } from '../utils/helper';

const Profile = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-12 flex items-center justify-center rounded-full text-white font-medium bg-slate-300"
        aria-label="User Avatar"
      >
        {getInitials(userInfo?.fullName || 'Guest')}
      </div>
      <div>
        <p className="text-md font-medium text-white">
          {userInfo?.fullName || 'Guest User'}
        </p>
        <button
          className="text-md text-white "
          onClick={onLogout}
          aria-label="Logout Button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
