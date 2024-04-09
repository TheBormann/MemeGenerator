import React from 'react';

import { useRouteError } from 'react-router-dom';

function Error() {
  const error = useRouteError();
  console.error(error);
  return (
    <div
      id="error-page"
      className="flex min-h-screen flex-col items-center justify-center"
    >
      <h1 className="mb-6 text-5xl font-bold">Oops!</h1>
      <p className="mb-6 text-3xl ">Sorry, an unexpected error has occurred.</p>
      <p className=" text-error">
        <i>{error.statusText || error.message}</i>
      </p>
      <a className="btn mt-6" href="/">
        Go back to safety
      </a>
    </div>
  );
}

export default Error;
