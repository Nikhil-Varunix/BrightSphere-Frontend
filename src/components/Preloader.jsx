// src/components/Preloader.jsx
import React from "react";

const Preloader = () => {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const circleStyle = {
    width: "60px",
    height: "60px",
    border: "6px solid rgba(255, 255, 255, 0.3)",
    borderTop: "6px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const spinAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={overlayStyle}>
      <style>{spinAnimation}</style>
      <div style={circleStyle}></div>
    </div>
  );
};

export default Preloader;


