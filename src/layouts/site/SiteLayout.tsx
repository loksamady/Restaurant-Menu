import Header from "./Header";
import { Outlet } from "react-router-dom";
import React from "react";
import Footer from "./Footer";
const SiteLayout = React.memo(() => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
});

export default SiteLayout;
