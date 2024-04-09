import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';

import Footer from "../components/base/Footer";
import ApiController from '../data/ApiController';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

  const navigate = useNavigate();

  useEffect(() => {
      const authToken = sessionStorage.getItem('authToken');
      if (authToken) {
          navigate('/');
      }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        await ApiController.login(email, password);
        navigate('/');
    } catch (error) {
        setErrorMessage(error.message);
    }
};


  return (
  <>
    <div className="min-h-screen grid content-center justify-center">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <img
          src="/src/assets/title.gif"
          alt="logo"
          className="w-48 rounded-2xl"
        />
        <div className="w-full sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight md:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-4 sm:w-96 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="input-bordered input w-full max-w-md"
                  placeholder="name@company.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required
                  />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="input-bordered input w-full max-w-md"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to="/password_reset"
                  className="link-secondary link text-sm font-medium "
                >
                  Forgot password?
                </Link>
              </div>
              <button type="submit" className="btn-primary btn-block btn">
                Sign in
              </button>
              {errorMessage && <p className="text-error mt-2">{errorMessage}</p>}
              <p className="text-sm font-light">
                Don&apos;t have an account yet?{' '}
                <Link to="/signup" className="link-secondary link font-medium">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
  );
};

export default Login;
