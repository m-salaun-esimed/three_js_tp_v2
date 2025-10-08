import React, { FC } from "react";
import { useKeycloak } from "@react-keycloak/web";
import Sidebar from "../components/SideBar";
import UserAvatar from "../domains/User/components/UserAvatar";

const Home: FC = () => {
  const { keycloak, initialized } = useKeycloak();

  console.log("Keycloak instance:", keycloak, "Initialized:", initialized);

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:p-6 sm:ml-64 min-h-screen transition-all duration-300 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto space-y-6">
          <UserAvatar />
          
        </div>
      </div>
    </>
  );
};

export default Home;