import React, { Suspense } from "react";
import Spinner from "components/Spinner/Spinner";

const Loading = () => (
  <div style={{ paddingTop: "100px" }}>
    <Spinner loading />
  </div>
);

const RafaySuspense = (props) => {
  return <Suspense fallback={<Loading />}>{props.children}</Suspense>;
};
export default RafaySuspense;
