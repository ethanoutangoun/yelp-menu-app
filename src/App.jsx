import yelpLogo from "./assets/yelp.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card.jsx";



function App() {
  const API_KEY = import.meta.env.VITE_YELP_API_KEY;

 
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
    const businesses = await getBusinesses(API_KEY, search, location, latitude, longitude);
    setResults(businesses);
  };

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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
          const businesses = await getBusinesses(API_KEY, search, location, latitude, longitude);
          setResults(businesses);

          // Get the city name from the coordinates
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          setLocation(response.data.address.city);
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex gap-3 items-center w-full px-10 py-4 border-b">
        <img src={yelpLogo} alt="Yelp Logo" className="w-7 h-7" />
        <h1 className="font-semibold text-lg">Real Menu</h1>
      </div>

      <div className="px-10 mt-5">
        <h3>
          Not sure what to eat at a new spot and don&apos;t want to dig through countless reviews? Our software uses Natural Language
          Processing to enhance reviews across Yelp, Google, and other sources
          to provide you reliable ratings on specific menu items. Generate a
          menu for your restaurant of choice and see the most recommended meals.
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevents default form submission
            handleClick(); // Call your search function
          }}
          className="mt-5 flex gap-5 items-center"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-3/4"
            placeholder="Search for a restaurant..."
            // required
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-1/4"
            placeholder="Location"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Search
          </button>
        </form>

        {results && results.length > 0 && <h4 className="mt-3 text-xl font-bold">Showing results near {results[0].location.city}</h4>}

        <div className="mt-5 mb-10 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
          {results &&
            results.length > 0 &&
            results.map((data, index) => <Card key={index} {...data} />)}
        </div>
      </div>
    </div>
  );
}

export default App;
