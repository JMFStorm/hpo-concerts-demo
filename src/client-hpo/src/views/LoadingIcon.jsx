import React from "react";

const LoadingIcon = ({ sizePixels }) => {
  const borderWidth = sizePixels / 5;
  return (
    <div className="loader-wrap">
      <div
        style={{
          width: sizePixels,
          height: sizePixels,
          border: `${borderWidth}px solid #f3f3f3`,
          borderTop: `${borderWidth}px solid #005859`,
        }}
        className="loader"
      ></div>
    </div>
  );
};

export default LoadingIcon;
