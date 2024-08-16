import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {


  return (
    <div className="flex flex-col">
      <Navbar />

      <div className="px-5 sm:px-10 mt-[60px]">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
