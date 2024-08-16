import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="/restaurant/:id" element={<Restaurant />}></Route>
      <Route path="*" element={<div>404 Not Found</div>} />
    </Route>
  )
);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
