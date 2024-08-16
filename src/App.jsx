import yelpLogo from "./assets/yelp.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card.jsx";

const data = [
  {
    id: 1,
    alias: "chipotle-atascadero",
    image: "https://s3-media1.fl.yelpcdn.com/bphoto/_enIA3QbvYomHeTpsk3Taw/o.jpg",
    name: "Chipotle",
    location: "Atascadero",
  },
  {
    id: 2,
    alias: "chipotle-atascadero",
    image: "mock",
    name: "Chipotle",
    location: "Atascadero",
  },
  {
    id: 3,
    alias: "chipotle-atascadero",
    image: "mock",
    name: "Chipotle",
    location: "Atascadero",
  },
];

function App() {
  const API_KEY =
    "7u7f4hnc4Q1kiadm_pLn7rcpD8weqezG_dAej8bwnNU4Wf7iX6pbd_wXFC5UZ0oFu7xzcME_Ou9UM0YzvsJf0fCuskyp4hQP8A7EC2EsgytUlx_DlhvmVvrgRPS9ZnYx";
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
  };

  const getReviews = (business_id) => {
    axios
      .get(`https://api.yelp.com/v3/businesses/${business_id}/reviews`, {
        headers,
      })
      .then((reviewResponse) => {
        const reviews = reviewResponse.data.reviews;
        reviews.forEach((review) => {
          console.log(`User: ${review.user.name}`);
          console.log(`Rating: ${review.rating}`);
          console.log(`Review: ${review.text}\n`);
        });
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  };

  const getBusinesses = async (apiKey, term, location) => {
    console.log("fetching busness id");
    const headers = {
      Authorization: `Bearer ${apiKey}`,
    };

    const params = {
      term: term,
      location: location,
    };

    try {
      const response = await axios.get(
        "https://api.yelp.com/v3/businesses/search",
        { headers, params }
      );
      const businesses = response.data.businesses;
      if (businesses.length > 0) {
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

  const term = "Chipotle";
  const location = "California";

  const handleClick = async () => {
    console.log("clicked");
    const businesses= await getBusinesses(API_KEY, term, location);
    setResults(businesses);
  };

  const [search, setSearch] = useState("");
  // const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log(results);
  }
  , [results]);
  
  return (
    <div className="flex flex-col">
      <div className="flex gap-3 items-center w-full px-10 py-4 border-b">
        <img src={yelpLogo} alt="Yelp Logo" className="w-8 h-8" />
        <h1 className="font-bold text-xl">Real Menu</h1>
      </div>

      <div className="px-10 mt-5">
        <h3>
          Not sure what to eat at a new spot? Our software uses Natural Language
          Processing to enhance reviews across Yelp, Google, and other sources
          to provide you reliable ratings on specific menu items. Generate a
          menu for your restaurant of choice and see the most recommended meals.
        </h3>

        <div className="mt-5 flex gap-5 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-1/2"
            placeholder="Search for a restaurant..."
          />

          <button
            className="bg-blue-500 text-white p-2 rounded-lg"
            onClick={handleClick}
          >
            {" "}
            Search{" "}
          </button>
        </div>

        <div className="mt-5 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
          {results.length > 0 && results.map((data, index) => (
            <Card key={index} {...data} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
