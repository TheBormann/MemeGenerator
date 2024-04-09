import type {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from 'react';

const SidebarLayout = (props: {
  navbar:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal;
  footer:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal;
  sidebar:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal;
  children:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal;
}) => (
  <div className="drawer-mobile drawer">
    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content flex min-h-screen flex-col">
      {props.navbar}
      <div className="mb-auto grid grid-cols-[min-content_1fr] pt-12 lg:grid-cols-1">
        <label
          htmlFor="my-drawer-2"
          className="btn-ghost drawer-button btn-circle btn col-start-2 mx-4 sm:col-start-1 sm:mx-2 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            />
          </svg>
        </label>
        <main className="col-start-2 w-full px-8 lg:col-start-1">
          {props.children}
        </main>
      </div>
      <div className="mt-12">{props.footer}</div>
    </div>
    <div className="drawer-side">
      <label htmlFor="my-drawer-2" className="drawer-overlay" />
      <aside className="h-screen w-80 border-r border-primary/20 bg-base-100 lg:w-40">
        <div className="border-r border-base-100 md:-mr-1">
          <div className="navbar sticky top-0 z-10 h-16 w-full border-b border-primary/20 bg-base-100">
            <a href="/" className="btn-ghost btn h-12 w-12 rounded-lg p-0">
              <img
                src="/src/assets/logo-large-rounded.svg"
                alt="logo"
                className="h-8 w-8"
              />
            </a>
          </div>
        </div>
        {props.sidebar}
      </aside>
    </div>
  </div>
);

export default SidebarLayout;
