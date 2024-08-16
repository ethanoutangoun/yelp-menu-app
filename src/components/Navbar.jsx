import yelpLogo from "../assets/yelp.svg";
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
      onClick={handleClick}
      className={`fixed top-0 left-0 w-full px-5 sm:px-10 py-4 flex z-50 justify-between backdrop-blur-lg bg-white/30 border border-white/10 
 dark:bg-background transition duration-1000 ease-in-out`}
    >
      <div className="flex gap-3 items-center">
        <img
          src={yelpLogo}
          alt="Yelp Logo"
          className="w-7 h-7 hover:cursor-pointer"
        />
        <h1 className="font-semibold text-lg hover:cursor-pointer">
          MenuMeter
        </h1>
      </div>

      <div className="text-white bg-red-600 p-1 text-sm font-semibold rounded-md hover:text-white">
        <a className="hover:text-gray-200">About</a>
      </div>
    </div>
  );
};

export default Navbar;
