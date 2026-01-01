import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card.jsx";
import Skeleton from "../components/Skeleton";
import { Search, MapPin } from "lucide-react";
import { mockData } from "../mockdata";

const Feed = () => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const PROD = import.meta.env.VITE_PROD;

  // const getBusinesses = async (apiKey, term, location, latitude, longitude) => {
  //   if (!location && (!latitude || !longitude)) {
  //     console.log("Location or latitude and longitude not specified");
  //     return;
  //   }

  //   console.log("fetching busness id");
  //   const headers = {
  //     Authorization: `Bearer ${apiKey}`,
  //   };

  //   const params = {
  //     term: term,
  //     limit: 12,
  //     ...(location && { location: location }),
  //     ...(latitude && !location && { latitude: latitude }),
  //     ...(longitude && !location && { longitude: longitude }),
  //   };

  //   try {
  //     const response = await axios.get(
  //       "https://api.yelp.com/v3/businesses/search",
  //       { headers, params }
  //     );
  //     const businesses = response.data.businesses;
  //     if (businesses.length > 0) {
  //       console.log(businesses);
  //       return businesses;
  //     } else {
  //       console.log("Business not found");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return null;
  //   }
  // };

  const getBusinesses = async (apiKey, term, location, latitude, longitude) => {
    try {
      let response;

      //
      // 1️⃣ If term AND location → SearchText:  "ramen in Bangkok"
      //
      if (term && location) {
        response = await axios.post(
          "https://places.googleapis.com/v1/places:searchText",
          {
            textQuery: `${term} in ${location}`,
            pageSize: 12,
            languageCode: "en",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask":
                "places.id,places.displayName,places.photos,places.rating,places.userRatingCount,places.addressComponents",
            },
          }
        );
      }

      //
      // 2️⃣ If term ONLY → SearchText: "ramen"
      //
      else if (term && !location) {
        response = await axios.post(
          "https://places.googleapis.com/v1/places:searchText",
          {
            textQuery: term,
            pageSize: 12,
            languageCode: "en",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask":
                "places.id,places.displayName,places.photos,places.rating,places.userRatingCount,places.addressComponents",
            },
          }
        );
      }

      //
      // 3️⃣ Otherwise → Nearby search (requires lat/lng)
      //
      else if (latitude && longitude) {
        response = await axios.post(
          "https://places.googleapis.com/v1/places:searchNearby",
          {
            includedTypes: ["restaurant"],
            maxResultCount: 12,
            locationRestriction: {
              circle: {
                center: {
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                },
                radius: 500.0,
              },
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask":
                "places.id,places.displayName,places.photos,places.rating,places.userRatingCount,places.addressComponents",
            },
          }
        );
      }

      //
      // 🚫 If none are provided — stop gracefully
      //
      else {
        console.warn("⚠️ No term OR lat/lng — cannot fetch businesses");
        return null;
      }

      const businesses = response.data?.places ?? [];

      //
      // Helper: convert Places photo name into a usable image URL
      //
      const get_photo_url = (name) => {
        if (!name) return null;
        const url = new URL(`https://places.googleapis.com/v1/${name}/media`);
        url.searchParams.set("key", apiKey);
        url.searchParams.set("maxHeightPx", "1000");
        url.searchParams.set("maxWidthPx", "1000");
        return url.toString();
      };

      //
      // Safe helpers to parse location without crashing
      //
      const pick_component = (components, types) => {
        if (!Array.isArray(components)) return null;
        return (
          components.find(
            (c) =>
              Array.isArray(c.types) && c.types.some((t) => types.includes(t))
          ) ?? null
        );
      };

      const parse_location = (components) => {
        const arr = Array.isArray(components) ? components : [];

        const street_number = pick_component(arr, ["street_number"])?.longText;
        const route = pick_component(arr, ["route"])?.longText;
        const city =
          pick_component(arr, ["locality"])?.longText ??
          pick_component(arr, ["sublocality_level_1"])?.longText ??
          null;
        const state =
          pick_component(arr, ["administrative_area_level_1"])?.shortText ??
          null;
        const zip_code = pick_component(arr, ["postal_code"])?.longText ?? null;
        const country = pick_component(arr, ["country"])?.shortText ?? null;

        const address1 =
          [street_number, route].filter(Boolean).join(" ") || null;
        const line2 = [city, state, zip_code].filter(Boolean).join(" ") || null;

        return {
          address1,
          address2: null,
          address3: null,
          city,
          zip_code,
          country,
          state,
          display_address: [address1, line2].filter(Boolean),
        };
      };

      //
      // Shape response → Yelp-like objects
      //
      return businesses.map(
        ({
          id,
          rating,
          userRatingCount,
          displayName,
          photos,
          addressComponents,
        }) => ({
          id,
          name: displayName?.text ?? null,
          alias: displayName?.text ?? null,
          rating: rating ?? null,
          review_count: userRatingCount ?? null,
          image_url: get_photo_url(photos?.[0]?.name),
          location: parse_location(addressComponents),
        })
      );
    } catch (err) {
      console.error("❌ Error fetching from Google Places API:", err);
      return null;
    }
  };

  const handleClick = async () => {
    if (PROD === "false") {
      console.log("Searching disabled in development mode");
      return;
    }

    console.log("clicked");
    const businesses = await getBusinesses(
      API_KEY,
      search,
      location,
      latitude,
      longitude
    );

    console.log("Setting results:", businesses);
    setResults(businesses);
  };

  let dev_mode = true;

  if (PROD === "true") {
    dev_mode = false;
  }

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
            "food",
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
      <h2 className="text-3xl font-bold my-3 mt-5 flex gap-1 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        Create Rated Menus <span className="hidden md:flex"> on the Fly</span>{" "}
      </h2>
      <h3 className=" text-sm text-gray-500 dark:text-gray-400 max-w-[700px] transition-colors duration-200">
        Not sure what to eat at a new spot and don&apos;t want to dig through
        countless reviews? <br className="md:flex hidden" /> Generate a menu for
        your restaurant of choice and see ratings for each meal.
      </h3>

      <form
        id="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleClick();
        }}
        className="mt-5 flex gap-5 items-center"
      >
        <div className="flex gap-3 items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-1/2 md:w-3/4 bg-white dark:bg-gray-800 transition-colors duration-200">
          <Search className="w-6 h-6 text-gray-500 dark:text-gray-400" />

          <input
            type="text"
            // id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:outline-none w-full bg-inherit text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Search for a restaurant..."
          />
        </div>

        <div className="flex gap-3 items-center border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-1/4 bg-white dark:bg-gray-800 transition-colors duration-200">
          <MapPin className="w-6 h-6 text-gray-500 dark:text-gray-400" />

          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className=" focus:outline-none w-full bg-inherit text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
        <h4 className="mt-3 text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Showing restaurants near{" "}
          <span className="text-red-700 dark:text-red-500">{results[0]?.location?.city}</span>
        </h4>
      )}

      {dev_mode && (
        <h4 className="mt-3 text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Showing restaurants near{" "}
          <span className="text-red-700 dark:text-red-400">{mockData[0]?.location?.city}</span>
        </h4>
      )}

      <div className="mt-5 mb-10 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7">
        {dev_mode &&
          mockData.map((data, index) => <Card key={index} {...data} />)}
        {results &&
          results.length > 0 &&
          results.map((data, index) => <Card key={index} {...data} />)}

        {results.length === 0 && !loading && !dev_mode && (
          <p className="min-h-[calc(100vh-340px)] text-gray-500 dark:text-gray-400 transition-colors duration-200">No restaurants found.</p>
        )}
      </div>
    </>
  );
};

export default Feed;
