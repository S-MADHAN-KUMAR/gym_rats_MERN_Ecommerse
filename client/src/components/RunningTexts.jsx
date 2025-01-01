import React, { useEffect, useRef } from "react";

const RunningTexts = ({ setting }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const { runSide } = setting;
    const animationDirection = runSide === "right" ? "100%" : "-100%";

    const animate = () => {
      if (textRef.current) {
        textRef.current.style.transform = `translateX(${animationDirection})`;
        textRef.current.style.transition = "transform 10s linear infinite";
        textRef.current.style.transform = "translateX(0)";
      }
    };

    animate();
  }, [setting]);

  return (
    <div
      className={`overflow-hidden w-full ${setting.position}`}
      style={{ whiteSpace: "nowrap" }}
    >
      <div
        ref={textRef}
        className={`inline-block ${setting.css}`}
        style={{ transform: "translateX(100%)" }}
      >
        {setting.quotes}
      </div>
    </div>
  );
};

export default RunningTexts;
