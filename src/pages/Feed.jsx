import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card.jsx";
import Skeleton from "../components/Skeleton";
import { Search, MapPin } from "lucide-react";
import { mockData } from "../mockdata";


const Feed = () => {
  // const API_KEY = import.meta.env.VITE_YELP_API_KEY;
  const API_KEY = import.meta.env.VITE_DEV_API_KEY;
  // const API_KEY = null;

  const getBusinesses = async (apiKey, term, location, latitude, longitude) => {
    if (!location && (!latitude || !longitude)) {
      console.log("Location or latitude and longitude not specified");
      return;
    }

    console.log("fetching busness id");
    const headers = {
      Authorization: `Bearer ${apiKey}`,
    };

    const params = {
      term: term,
      limit: 12,
      ...(location && { location: location }),
      ...(latitude && !location && { latitude: latitude }),
      ...(longitude && !location && { longitude: longitude }),
    };

    try {
      const response = await axios.get(
        "https://api.yelp.com/v3/businesses/search",
        { headers, params }
      );
      const businesses = response.data.businesses;
      if (businesses.length > 0) {
        console.log(businesses);
        return businesses;
      } else {
        console.log("Business not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const handleClick = async () => {
    console.log("clicked");
    const businesses = await getBusinesses(
      API_KEY,
      search,
      location,
      latitude,
      longitude
    );
    setResults(businesses);
  };

  const dev_mode = true;

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(true);

  // console.log(mockData);

  useEffect(() => {
    const fetchData = async () => {
      if (!API_KEY) {
        console.error("API Key not found");
        return;
      }

      if (dev_mode) {
        console.log("dev mode");
        return;
      }

      try {
        console.log(results);

        if (navigator.geolocation) {
          // Get the current position using a promise
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          // Fetch businesses
          const businesses = await getBusinesses(
            API_KEY,
            search,
            location,
            latitude,
            longitude
          );
          setResults(businesses);

          setLoading(false);

          // Get the city name from the coordinates
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          setLocation(response.data.address.city);
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h2 className="text-3xl font-bold my-3 mt-5 flex gap-1">
        Create Rated Menus{" "}
        <span className="hidden md:flex"> on the Fly</span>{" "}
      </h2>
      <h3 className=" text-sm text-gray-500 max-w-[700px]">
        Not sure what to eat at a new spot and don&apos;t want to dig through
        countless reviews? <br className="md:flex hidden" /> Generate a menu for
        your restaurant of choice and see ratings for each meal.
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault(); 
          handleClick(); 
        }}
        className="mt-5 flex gap-5 items-center"
      >
        <div className="flex gap-3 items-center border border-gray-300 rounded-lg p-2 w-1/2 md:w-3/4">
          <Search className="w-6 h-6 text-gray-500" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:outline-none w-full"
            placeholder="Search for a restaurant..."
          />
        </div>

        <div className="flex gap-3 items-center border border-gray-300 rounded-lg p-2 w-1/4 ">
          <MapPin className="w-6 h-6 text-gray-500" />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className=" focus:outline-none w-full"
            placeholder="Location"
          />
        </div>

        <button type="submit" className="bg-red-600 text-white p-2 rounded-lg">
          Search
        </button>
      </form>

      {!dev_mode && loading && (
        <div className="mt-5 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} />
          ))}
        </div>
      )}

      {results && results.length > 0 && (
        <h4 className="mt-3 text-xl font-semibold">
          Showing restaurants near{" "}
          <span className="text-red-700">{results[0].location.city}</span>
        </h4>
      )}

      {dev_mode && (
        <h4 className="mt-3 text-xl font-semibold">
          Showing restaurants near{" "}
          <span className="text-red-700">{mockData[0].location.city}</span>
        </h4>
      )}

      <div className="mt-5 mb-10 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
        {dev_mode &&
          mockData.map((data, index) => <Card key={index} {...data} />)}

        {results &&
          results.length > 0 &&
          results.map((data, index) => <Card key={index} {...data} />)}
      </div>
    </>
  );
};

export default Feed;
