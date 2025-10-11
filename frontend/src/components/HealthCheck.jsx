import React, { useEffect, useState } from "react";

const HealthCheck = () => {
  const [health, setHealth] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:8080/health")
      .then((res) => res.text())
      .then(setHealth)
      .catch(() => setHealth("Error"));
  }, []);

  return (
    <div>
      <h2>Backend Health Status:</h2>
      <p>{health}</p>
    </div>
  );
};

export default HealthCheck;
