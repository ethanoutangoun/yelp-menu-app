import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {


  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="px-5 sm:px-10 mt-[60px] flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
