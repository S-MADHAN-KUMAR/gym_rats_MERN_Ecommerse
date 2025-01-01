import React from "react";

const SuccessComponent = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for your order. Your payment has been processed successfully.</p>
      <a href="/" style={{ textDecoration: "none", color: "blue" }}>
        Return to Home
      </a>
    </div>
  );
};

export default SuccessComponent;
