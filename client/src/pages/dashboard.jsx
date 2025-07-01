import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import { navigate } from "gatsby";

const Dashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.email || "Usuario"}!</p>
    </div>
  );
};

export default Dashboard;
