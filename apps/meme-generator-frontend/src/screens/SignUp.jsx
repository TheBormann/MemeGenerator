import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import Footer from "../components/base/Footer";
import ApiController from '../data/ApiController';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); 

  const navigate = useNavigate();

  useEffect(() => {
      const authToken = sessionStorage.getItem('authToken');
      if (authToken) {
          navigate('/');
      }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await ApiController.signUp(formData);
        navigate('/');
    } catch (error) {
        setErrorMessage(error.message);
    }
};

  return (
    <>
      <div className="grid min-h-screen content-center justify-center">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <img
            src="/src/assets/signUp.gif"
            alt="logo"
            className="w-64 rounded-2xl"
          />
          <div className="w-full sm:max-w-md md:mt-0 xl:p-0">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight md:text-2xl">
                Sign up to your account
              </h1>
              <form className="space-y-4 sm:w-96 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="mb-2 block text-sm font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="input-bordered input w-full max-w-md"
                    placeholder="Your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                    value={formData.email}
                    onChange={handleInputChange}
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
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password" className="label">
                    <span className="label-text-alt">
                      Minimum length is 8 characters.
                    </span>
                  </label>
                </div>
                <button type="submit" className="btn-primary btn-block btn">
                  Sign up
                </button>
                {errorMessage && <p className="text-error mt-2">{errorMessage}</p>}
                <p className="text-sm font-light">
                  Already have an account?{' '}
                  <Link to="/login" className="link-secondary link font-medium">
                    Sign in
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

export default SignUp;
