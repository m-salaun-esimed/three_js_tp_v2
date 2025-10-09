import React, { FC } from "react";
import { useKeycloak } from "@react-keycloak/web";
import Sidebar from "../components/SideBar";
import UserAvatar from "../domains/User/components/UserAvatar";
import { showToastError, showToastSuccess, showToastWarning } from "@/utils/Toast";
import { Button } from "@/components/ui/button";

const Home: FC = () => {
  const { keycloak, initialized } = useKeycloak();

  console.log("Keycloak instance:", keycloak, "Initialized:", initialized);

  const handleError = () => {
    showToastError("This is an error message!");
  };

  const handleSuccess = () => {
    showToastSuccess("This is a success message!");
  };

  const handleWarning = () => {
    showToastWarning("This is a warning message!");
  };

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:p-6 sm:ml-64 min-h-screen transition-all duration-300 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto space-y-6">
          <UserAvatar />
          <div className="flex space-x-4">
            <Button
              onClick={handleError}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-all duration-200"
            >
              Error
            </Button>
            <Button
              onClick={handleSuccess}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-200"
            >
              Success
            </Button>
            <Button
              onClick={handleWarning}
              className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 transition-all duration-200"
            >
              Warning
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;