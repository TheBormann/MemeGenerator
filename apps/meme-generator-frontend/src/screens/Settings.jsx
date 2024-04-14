import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import SettingsSegment from '../components/Settings/SettingsSegment';
import ApiController from "../data/ApiController";

const Settings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: JSON.parse(sessionStorage.getItem('userData')).email || '',
    username: JSON.parse(sessionStorage.getItem('userData')).username || '',
    password: '',
    repeatPassword: '',
    read_feed: JSON.parse(sessionStorage.getItem('userData')).read_feed || false,
    read_details: JSON.parse(sessionStorage.getItem('userData')).read_details || false,
    read_comments: JSON.parse(sessionStorage.getItem('userData')).read_comments || false,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    if (e.target.type === 'checkbox') {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    } else {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword && (formData.password !== null || formData.repeatPassword !== null)) {
      setErrorMessage('Password and repeat password do not match');
      return; 
    }

    try {
      console.log('formData', formData);
      console.log('sessionStorage', sessionStorage.getItem('userData'));
      await ApiController.postUserDataChanges(formData);
      sessionStorage.removeItem('userData');
      await ApiController.fetchUserData();
      navigate('/');
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message 
      ? error.response.data.message 
      : 'An unknown error occurred';
      setErrorMessage(errorMessage);
    }
  };

  return (
    <BaseLayout>
    <form className=" px-10 grid w-full" onSubmit={handleSubmit}>
        <h1 className="mb-6 text-5xl font-bold">Settings</h1>
        <SettingsSegment
          title="Main settings"
          desc="This information will appear on your profile."
        >
          <div className="">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              disabled={true}
              className="input-bordered input w-full max-w-md"
              placeholder={JSON.parse(sessionStorage.getItem('userData')).email}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className='mt-8'>
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
            />
          </div>
          <div className="mt-8">
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              New password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="input-bordered input w-full max-w-md"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-8">
            <label
              htmlFor="repeatPassword"
              className="mb-2 block text-sm font-medium"
            >
              Repeat password
            </label>
            <input
              type="password"
              name="repeatPassword"
              id="repeatPassword"
              placeholder="••••••••"
              className="input-bordered input w-full max-w-md"
              value={formData.repeatPassword}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn-primary btn mt-8">Save</button>
          {errorMessage && <p className="text-error mt-2">{errorMessage}</p>}
        </SettingsSegment>

        <SettingsSegment
          title="Text-to-Speech Settings"
          desc="Customize how text-to-speech is used in the application."
        >
          <div className="flex flex-col gap-4">
            <div>
              <input
                type="checkbox"
                name="read_feed"
                id="read_feed"
                className='toggle'
                checked={formData.read_feed}
                onChange={handleInputChange}
              />
              <label htmlFor="read_feed" className="ml-2">Read feed</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="read_details"
                id="read_details"
                className='toggle'
                checked={formData.read_details}
                onChange={handleInputChange}
              />
              <label htmlFor="read_details" className="ml-2">Read meme detail page</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="read_comments"
                id="read_comments"
                className='toggle'
                checked={formData.read_comments}
                onChange={handleInputChange}
              />
              <label htmlFor="read_comments" className="ml-2">Read comments</label>
            </div>
          </div>
          <button type="submit" className="btn-primary btn mt-8">Save</button>
          {errorMessage && <p className="text-error mt-2">{errorMessage}</p>}
        </SettingsSegment>
      </form>
    </BaseLayout>
  );
};

export default Settings;
