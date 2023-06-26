import React from "react";
import Navbar from "./components/navbar";

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
}

export default Layout;
