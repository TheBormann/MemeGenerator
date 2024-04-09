import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Navbar = (props) => {
  const navigate = useNavigate();

  function logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    navigate('/login');
  }

  return (
    <div className="sticky top-0 z-30 flex h-16 w-full border-b border-primary/20 bg-base-100">
      <nav className="navbar w-full">
        <div className="navbar-start flex-1">
          <Link
            to="/"
            className={`btn-ghost btn h-12 w-12 rounded-lg p-0 ${props.hasSidebar ? 'lg:hidden' : ''
              }`}
          >
            <img
              src="/src/assets/title.gif"
              alt="logo"
              className="h-10 w-10 rounded-md"
            />
          </Link>
        </div>

        <div className="flex-none">
          <Link to="/create-meme" className="btn-ghost btn-circle btn">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </div>
          </Link>
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn btn-circle gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-64 bg-base-100 p-2 shadow"
            >

              <li>
                <Link to="/settings/">Settings</Link>
              </li>
              <li>
                <Link to="/history">History</Link>
              </li>
              <li>
                <Link to="/stats">Statistics</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

Navbar.defaultProps = {
  hasSidebar: false,
};
