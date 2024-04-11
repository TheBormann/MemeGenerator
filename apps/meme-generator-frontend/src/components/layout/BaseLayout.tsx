import React from "react";
import Footer from "../base/Footer";
import Navbar from "../base/Navbar";

const BaseLayout = (props) => {
  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar hasSidebar={false} />
      </div>
      <main className={` ${props.className || 'pt-24'}`}>
        {props.children}
      </main>
      {props.showFooter !== false && <Footer />}
    </>
  );
};

export default BaseLayout;
