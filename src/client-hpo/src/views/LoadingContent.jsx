import React from "react";

import LoadingIcon from "./LoadingIcon";

const LoadingContent = (props) => {
  return props.loading ? <LoadingIcon sizePixels={props.loadingSizePixels ?? 50} /> : <>{props.children}</>;
};

export default LoadingContent;
