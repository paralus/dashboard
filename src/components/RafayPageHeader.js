import React from "react";
import T from "i18n-react";

const RafayPageHeader = ({ title, help, breadcrumb }) => {
  return (
    <>
      {breadcrumb ? (
        <>
          <div className="mb-1">{breadcrumb}</div>
          {title && (
            <h2 style={{ color: "#ff9800" }}>
              <T.span text={title} />
            </h2>
          )}
        </>
      ) : (
        <h1 style={{ color: "#ff9800" }}>{title}</h1>
      )}
      {help && (
        <div className="text-muted font-italic mb-3">
          <T.span text={help} />
        </div>
      )}
    </>
  );
};

export default RafayPageHeader;
