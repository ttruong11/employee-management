import { useSession, signIn } from 'next-auth/react';
import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';



const Dashboard = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect(() => {
    if (!loading && !session) signIn('credentials');
  }, [session, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar /> 
      <div className="">
      </div>
      <div className="main-content">

      </div>
    </div>
  );
};

export default Dashboard;