import React from "react";

const FailureComponent = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Payment Failed!</h1>
      <p>We're sorry, but your payment could not be processed.</p>
      <p>Please try again or contact support for assistance.</p>
      <a href="/" style={{ textDecoration: "none", color: "blue" }}>
        Return to Home
      </a>
    </div>
  );
};

export default FailureComponent;
