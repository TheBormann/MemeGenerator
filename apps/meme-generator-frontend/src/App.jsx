import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { MemeProvider } from "./contexts/memeContext";

function App() {
  return <MemeProvider><RouterProvider router={router} /></MemeProvider>;
}

export default App;