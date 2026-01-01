import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Feed from "./pages/Feed";
import About from "./pages/About";
import { ThemeProvider } from "./contexts/ThemeContext";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />}>
        <Route index element={<Feed />} />
        <Route path="/restaurant/:id" element={<Restaurant />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Route>
  )
);

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
