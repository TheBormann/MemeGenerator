import { createBrowserRouter } from "react-router-dom";
import Error from "../screens/Error";
import Login from "../screens/Login";
import Home from "../screens/Home";
import SignUp from "../screens/SignUp";
import PasswordReset from "../screens/PasswordReset";
import Settings from "../screens/Settings";
import CreateMemePage from "../screens/CreateMeme";
import History from "../screens/History";
import React from "react";
import AuthenticatedWrapper from './AuthenticatedWrapper.jsx';
import SingleView from "../screens/SingleView.jsx";
import SetNewPassword from "../screens/SetNewPassword.jsx";
import Statistics from "../screens/Statistics.jsx";
import SelectTemplate from "../screens/SelectTemplate.jsx";
import UploadTemplate from "../screens/UploadTemplate.jsx";
import { MemeProvider } from '../contexts/memeContext.jsx';
import EditMemePage from "../screens/EditMeme.jsx";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <Error />,
  },
  {
    path: "/password_reset",
    element: <PasswordReset />,
    errorElement: <Error />,
  },
  {
    path: "/password_reset/:token",
    element: <SetNewPassword />,
    errorElement: <Error />,
  },
  {
    path: "/",
    element: (
      <AuthenticatedWrapper>
        <Home />
      </AuthenticatedWrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/settings",
    element: (
      <AuthenticatedWrapper>
        <Settings />
      </AuthenticatedWrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/stats",
    element: (
      <AuthenticatedWrapper>
        <Statistics />
      </AuthenticatedWrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/select-template",
    element: (
      <AuthenticatedWrapper>
        <SelectTemplate />
      </AuthenticatedWrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/upload-template",
    element: (
      <AuthenticatedWrapper>
        <UploadTemplate />
      </AuthenticatedWrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/create-meme",
    element: (
      <AuthenticatedWrapper>
        <CreateMemePage />
      </AuthenticatedWrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/edit-meme/:id",
    element: (
      <AuthenticatedWrapper>
        <EditMemePage />
      </AuthenticatedWrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/Single-View/:id",
    element: <SingleView />,
    errorElement: <Error />,
  },
  {
    path: "/history",
    element: (
      <AuthenticatedWrapper>
        <History />
      </AuthenticatedWrapper>
    ),
    errorElement: <Error />,
  },
]);