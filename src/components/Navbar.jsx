import yelpLogo from "../assets/icon.png";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

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
      className={`fixed top-0 left-0 w-full px-5 sm:px-10 py-4 flex z-50 justify-between backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-white/10 dark:border-gray-700/50 transition duration-300 ease-in-out`}
    >
      <div onClick={handleClick} className="flex gap-3 items-center">
        <img
          src={yelpLogo}
          alt="Yelp Logo"
          className="w-7 h-7 hover:cursor-pointer"
        />
        <h1 className="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:cursor-pointer transition-colors duration-200">
          MenuMeter
        </h1>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 hover:cursor-pointer outline-none focus:outline-none focus-visible:outline-none"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </div>
  );
};

export default Navbar;
