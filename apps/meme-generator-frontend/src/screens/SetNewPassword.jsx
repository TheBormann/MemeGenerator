import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams  } from 'react-router-dom';


import ApiController from '../data/ApiController';

const SetNewPassword = () => {
  let { token } = useParams();
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
        await ApiController.setNewPassword(token, password);
        navigate('/login');
    } catch (error) {
        setErrorMessage(error.message);
    }
};

  return (
    <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <img
        src="/src/assets/forgotPassword.webp"
        alt="logo"
        className="w-64 rounded-2xl"
      />
      <div className="w-full sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Set your new password
          </h1>
          <form className="space-y-4 sm:w-96 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="input-bordered input w-full max-w-md"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col items-center justify-between">
            <button type="submit" className="btn-primary btn-block btn">
              Change password
            </button>
            {errorMessage && <p className="text-error mt-2">{errorMessage}</p>}
            <Link to="/login" className=" mt-6">
              back
            </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
