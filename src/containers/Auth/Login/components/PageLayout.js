import React from "react";
import { Helmet } from "react-helmet";
import Footer from "components/Footer";

const capitalize = string => {
  if (!string) {
    return " ";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const PageTitle = ({ partnerDetail }) => {
  if (!partnerDetail) return null;
  const { fav_icon_link, name } = partnerDetail;
  const favicon_src =
    "https://pbs.twimg.com/profile_images/934706849508573186/_l78sPtc_400x400.jpg";
  return (
    <Helmet>
      <title>{capitalize(name)}</title>
      <link
        rel="icon"
        type="image/x-icon"
        href={fav_icon_link || favicon_src}
      />
    </Helmet>
  );
};

const LoginHeader = ({ partnerDetail }) => {
  if (!partnerDetail) return null;
  const { logo_link } = partnerDetail;
  const image_src =
    "https://rafay-image.s3-us-west-2.amazonaws.com/rafay-logo-transparent.png";
  return (
    <div className="login-header mb-4">
      <a className="app-logo" href="#/" title="">
        <img src={logo_link || image_src} alt="" title="" />
      </a>
    </div>
  );
};

const PageLayout = ({ partnerDetail, children }) => {
  return (
    <div className="app-container">
      <PageTitle partnerDetail={partnerDetail} />

      <div className="app-main-container">
        <main className="app-main-content-wrapper">
          <div className="app-main-content">
            <div className="login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
              <div className="login-content text-center">
                <LoginHeader partnerDetail={partnerDetail} />
                <div className="login-form">{children}</div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
