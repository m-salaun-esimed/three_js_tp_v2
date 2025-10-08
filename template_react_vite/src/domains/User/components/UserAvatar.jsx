import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function UserAvatar() {
  const { firstName, lastName, email, username } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const avatarRef = useRef(null);
  const menuRef = useRef(null);

  const handleClick = (event) => {
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarRef.current &&
        menuRef.current &&
        !avatarRef.current.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const firstLetter = firstName ? firstName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="absolute top-4 right-4">
      {/* Avatar */}
      <div
        ref={avatarRef}
        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-black dark:text-white text-lg font-bold cursor-pointer hover:bg-blue-700 transition"
        onClick={handleClick}
      >
        <Avatar>
          <AvatarImage />
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
      </div>
      {/* Menu déroulant */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
        >
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