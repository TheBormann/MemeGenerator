import type {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from "react";
import Footer from "../base/Footer";
import Navbar from "../base/Navbar";

const BaseLayout = (props: {
  className?: string;
  children:
  | ReactElement<any, string | JSXElementConstructor<any>>
  | ReactFragment
  | ReactPortal;
  showFooter?: boolean;
}) => (
  <>
    <Navbar hasSidebar={false} />
    <main className={props.className || `pt-12`}>{props.children}</main>
    {props.showFooter !== false && <Footer />}
  </>
);

export default BaseLayout;
