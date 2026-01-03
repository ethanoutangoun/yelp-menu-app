import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { process_reviews, process_clusters, get_reviews } from "../utils";
import Menu from "../components/Menu";
import { StarIcon } from "lucide-react";
import HighlightCard from "../components/HighlightCard";
import axios from "axios";
import LoadingBar from "../components/LoadingBar";
import { mockMenuData } from "../mockMenuData";
import { getReviews } from "../utils/get_reviews";
import { processReviews } from "../utils/process_reviews";

const Restaurant = () => {
  const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;
  const API_URL = import.meta.env.VITE_API_URL;

  // const { id } = useParams();
  // const [reviews, setReviews] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [menu, setMenu] = useState(null);
  const [show_loading, set_show_loading] = useState(false);

  const react_location = useLocation();

  useEffect(() => {
    const fetchStep = async (id) => {
      const response = await axios.get(`${API_URL}/business/${id}`);
      const exists = response.data.exists;

      if (!exists) {
        console.log("step 0");
        setStep(0);
        return;
      }

      setStep(1);

      const response2 = await axios.get(`${API_URL}/reviews/${id}`);
      const reviews = response2.data;
      if (reviews.length === 0) {
        console.log("step 1");
        return;
      }

      const menu = await get_menu(id);
      if (menu) {
        setStep(5);
      }
      setMenu(menu);
    };

    if (react_location?.state && !restaurant) {
      const { id, alias, image_url, name, location, rating, review_count } =
        react_location.state;

      const data = {
        id,
        alias,
        image_url,
        name,
        location,
        rating,
        review_count,
      };
      // Set the restaurant data to the state

      setRestaurant(data);

      // fetchStep(data.id);

      setLoading(false);

      console.log(data);
    }
  }, []);

  useEffect(() => {
    // scroll to top on mount

    window.scrollTo(0, 0);
  }, []);

  function flattenMenuItems(menuItems) {
    return menuItems.flatMap((category) => category.items);
  }

  // Use mock menu data when no menu exists
  const displayMenu = menu ? menu : null;

  // Once menu items loaded, trigger processing to determine menu highlights
  useEffect(() => {
    if (!displayMenu) {
      return;
    }
    const menu_items_flattened = flattenMenuItems(displayMenu);
    const calculate_most_reviewed = () => {
      let max = 0;

      // Determine max # reviews
      menu_items_flattened.forEach((item) => {
        if (item.num_reviews > max) {
          max = item.num_reviews;
        }
      });

      const most_reviewed = menu_items_flattened.filter(
        (item) => item.num_reviews === max
      );
      const most_reviewed_parsed = most_reviewed.map((item) => ({
        ...item,
        type: "most_reviewed",
      }));

      return most_reviewed_parsed;
    };

    const calculate_highest_rated = () => {
      let max = 0;
      let maxReviews = null;

      // Determine max # reviews
      menu_items_flattened.forEach((item) => {
        if (item.rating > max && item.num_reviews > 1) {
          max = item.rating;
          maxReviews = item.num_reviews;
        }

        if (item.rating === max && item.num_reviews > maxReviews) {
          maxReviews = item.num_reviews;
        }
      });

      const highest_rated = menu_items_flattened.filter(
        (item) => item.rating === max && item.num_reviews === maxReviews
      );
      const highest_rated_parsed = highest_rated.map((item) => ({
        ...item,
        type: "highest_rated",
      }));

      return highest_rated_parsed;
    };

    const most_reviewed = calculate_most_reviewed();

    const highest_rated = calculate_highest_rated();

    const highlights = [...most_reviewed, ...highest_rated];

    setHighlights(highlights);
  }, [displayMenu]);

  const map_steps = {
    0: "Adding Business",
    1: "Fetching Reviews",
    2: "AI Processing Reviews",
    3: "Clustering Reviews",
    4: "Generating Menu",
    5: "Menu Generated",
  };

  const handleGenerate = async () => {
    console.log("generating menu");
    set_show_loading(true);



    const reviews = await getReviews(restaurant.id);
    console.log(reviews);

    setStep(2);


    if (!restaurant) {
      console.error("Restaurant data not found");
      return;
    }

    const processed_reviews = await processReviews({reviews, placeId: restaurant.id});
    console.log("processed reviews:", processed_reviews);
    setStep(3);
    setStep(4);

    setMenu(processed_reviews);


    set_show_loading(false);
    setStep(5);
    setLoading(false);
  };


  const get_menu = async (bid) => {
    console.log("getting menu");
    const res = await axios.get(`${API_URL}/menu/${bid}`);
    return res.data;
  };

  const get_progress = () => {
    return (step / 5) * 100;
  };

  return (
    <div className="mb-10 min-h-[83vh]">
      <div className="mt-2 relative sm:h-52 h-40">
        {restaurant?.image_url ? (
          <img
            src={restaurant?.image_url}
            alt={restaurant?.name}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 rounded-md"></div>
        )}

        <div className="absolute top-0 left-0 w-full h-full rounded-md backdrop-blur-[6px]"></div>

        {restaurant && (
          <div className="absolute bottom-3 left-3 p-2">
            <h2 className="sm:text-3xl text-2xl font-extrabold text-white">
              {restaurant?.name}
            </h2>

            <div className="mt-3 flex items-center gap-3">
              {Array.from({ length: restaurant?.rating.toFixed(0) }, (_, i) => (
                <div key={i} className="p-1.5 bg-orange-400 rounded-lg">
                  <StarIcon size={16} className="text-white" fill="#ffffff" />
                </div>
              ))}

              {Array.from(
                { length: 5 - restaurant?.rating.toFixed(0) },
                (_, i) => (
                  <div key={i} className="p-1.5 bg-white/30 rounded-lg">
                    <StarIcon size={16} className="text-white" fill="#ffffff" />
                  </div>
                )
              )}

              <h4 className="text-white font-medium">
                {restaurant?.rating.toFixed(1)} ({restaurant?.review_count}{" "}
                reviews)
              </h4>
            </div>
          </div>
        )}
      </div>

      {displayMenu && (
        <div className="mt-5 py-4">
          <h4 className="text-xl font-semibold">Highlights</h4>

          <div className="my-4 flex items-center gap-4 overflow-auto w-full">
            {highlights.map((highlight, index) => (
              <HighlightCard key={index} {...highlight} />
            ))}
          </div>
          <Menu menu={displayMenu} />
        </div>
      )}

      {!loading && step < 5 && (
        <div className="mt-5 py-4">
          {step < 1 && (
            <>
              <h4 className="text-lg font-semibold">No Menu Found</h4>
              <p>
                It appears there are no records for this restaurant in our
                database. Please generate the menu by pressing the button below.
              </p>
            </>
          )}

          <button
            onClick={() => handleGenerate()}
            className="mt-3 p-2 bg-red-600 text-white rounded-lg"
          >
            Generate Menu
          </button>

          {step < 4 && show_loading && (
            <div className="text-red-600">
              <h3 className="text-black mt-5">{map_steps[step]}...</h3>

              <LoadingBar progress={get_progress()} />
            </div>
          )}
        </div>
      )}

      {/* {!menu && !loading && (
        <div className="flex flex-col gap-3 w-96">

          <AlertDialog />
          <button
            onClick={() => get_reviews(SERP_API_KEY, restaurant.id)}
            className="p-2 bg-red-600 text-white rounded-lg"
          >
            Get Reviews
          </button>

          <button
            className="p-2 bg-red-600 text-white rounded-lg"
            onClick={() => get_menu()}
          >
            Get Menu
          </button>
          <button
            className="p-2 bg-red-600 text-white rounded-lg"
            onClick={() => post_menu(menu_items)}
          >
            Post Menu
          </button>

          <button
            className="p-2 bg-red-600 text-white rounded-lg"
            onClick={() => process_clusters(API_KEY, menu_items_raw)}
          >
            Process clustered
          </button>

          <button
            className="p-2 bg-red-600 text-white rounded-lg"
            onClick={() => cluster()}
          >
            Cluster reviews
          </button>

          <button
            className="p-2 bg-red-600 text-white rounded-lg"
            onClick={() => console.log(processed_reviews)}
          >
            Log processed reviews
          </button>

          <button
            className="p-2 bg-red-600 text-white rounded-lg"
            onClick={() => console.log(menu_items)}
          >
            Log menu
          </button>

          <button
            className="p-2 bg-red-600 text-white rounded-lg"
            onClick={() => console.log(highlights)}
          >
            Log Highlights
          </button>
        </div>
      )} */}
    </div>
  );
};

export default Restaurant;
