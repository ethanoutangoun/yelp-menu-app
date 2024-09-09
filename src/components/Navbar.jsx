import yelpLogo from "../assets/icon.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full px-5 sm:px-10 py-4 flex z-50 justify-between backdrop-blur-lg bg-white/70 border border-white/10 
 dark:bg-background transition duration-1000 ease-in-out`}
    >
      <div onClick={handleClick} className="flex gap-3 items-center">
        <img
          src={yelpLogo}
          alt="Yelp Logo"
          className="w-7 h-7 hover:cursor-pointer"
        />
        <h1 className="font-semibold text-lg hover:cursor-pointer">
          MenuMeter
        </h1>
      </div>

      <div
        onClick={() => navigate("/about")}
        className="text-white bg-red-600 p-1 text-sm font-semibold rounded-md hover:text-white hover:cursor-pointer"
      >
        <p className="hover:text-gray-200">About</p>
      </div>
    </div>
  );
};

export default Navbar;
