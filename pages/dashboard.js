import { useSession, signIn } from 'next-auth/react';
import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';

// ... other imports

const Dashboard = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect(() => {
    if (!loading && !session) signIn('credentials');
  }, [session, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Including the Sidebar component */}
      <div className="">
      </div>
      <div className="main-content">
        {/* Your main content goes here */}
        {/* You can add more content or components here as needed */}
      </div>
    </div>
  );
};

export default Dashboard;