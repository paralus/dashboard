import React, { Suspense } from "react";
import Spinner from "components/Spinner/Spinner";

const Loading = () => (
  <div style={{ paddingTop: "100px" }}>
    <Spinner loading />
  </div>
);

const SuspenseComponent = (props) => {
  return <Suspense fallback={<Loading />}>{props.children}</Suspense>;
};
export default SuspenseComponent;
