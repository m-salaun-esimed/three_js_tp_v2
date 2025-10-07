import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function UserAvatar() {
  const { firstName, lastName, email, username } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const firstLetter = firstName ? firstName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="absolute top-4 right-4">
      {/* Avatar */}
      <div
        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold cursor-pointer hover:bg-blue-700 transition"
        onClick={handleClick}
      >
        {firstLetter}
      </div>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-4">
            <p className="text-base font-semibold text-gray-800">
              {firstName} {lastName}
            </p>
            <p className="text-sm text-gray-500">@{username || 'Non défini'}</p>
            <p className="text-sm text-gray-500">{email || 'Non défini'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAvatar;