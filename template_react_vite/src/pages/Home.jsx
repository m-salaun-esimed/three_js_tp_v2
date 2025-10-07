import React, { Fragment } from 'react';
import { useContext } from 'react';
import { KeycloakProvider } from '../contexts/KeycloakProvider';
import Sidebar from '../components/SideBar';

function Home() {
  const keycloak = useContext(KeycloakProvider);
  console.log(keycloak);
  return (
    <Fragment>
      <Sidebar />
      <div className="p-4 sm:p-6 sm:ml-64 bg-gray-50 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
