import { useParams, useLocation } from "react-router-dom";
import {
  restaurant_data,
  processed_reviews,
  menu_items,
  menu_items_raw,
} from "../mockdata";
import { useState, useEffect } from "react";
import { process_reviews } from "../utils";
import Menu from "../components/Menu";
import { StarIcon } from "lucide-react";
import HighlightCard from "../components/HighlightCard";

const Restaurant = (props) => {
  const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;

  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [highlights, setHighlights] = useState([]);

  const react_location = useLocation();

  useEffect(() => {
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

      //   console.log(data);
    }
  }, []);

  // Extract and transform the reviews data on mount
  useEffect(() => {
    // scroll to top on mount

    window.scrollTo(0, 0);
    // Extract and transform the reviews data on mount
    const transformedReviews = restaurant_data[0].reviews.map(
      ({ comment, rating }) => ({
        comment: comment.text,
        rating,
      })
    );

    // Update the state with the transformed reviews
    setReviews(transformedReviews);
  }, []);

  // Once menu items loaded, trigger processing to determine menu highlights
  useEffect(() => {
    if (!menu_items) {
      return;
    }

    const calculate_most_reviewed = () => {
      let max = 0;

      // Determine max # reviews
      menu_items_raw.forEach((item) => {
        if (item.reviews > max) {
          max = item.reviews;
        }
      });

      const most_reviewed = menu_items_raw.filter(
        (item) => item.reviews === max
      );
      const most_reviewed_parsed = most_reviewed.map((item) => ({
        ...item,
        type: "most_reviewed",
      }));

      return most_reviewed_parsed;
    };

    const calculate_highest_rated = () => {
      let max = 0;
      let maxIndex = null;
      let maxReviews = null;

      // Determine max # reviews
      menu_items_raw.forEach((item, index) => {
        if (item.rating > max && item.reviews > 1) {
          max = item.rating;
          maxIndex = index;
          maxReviews = item.reviews;
        }

        if (item.rating === max && item.reviews > maxReviews) {
          maxIndex = index;
          maxReviews = item.reviews;
        }
      });

      const highest_rated = menu_items_raw.filter(
        (item) => item.rating === max && item.reviews === maxReviews
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
  }, [menu_items]);

  return (
    <div className="mb-10 min-h-[83vh]">
      <div className="mt-1 relative h-72">
        {restaurant?.image_url ? (
          <img
            src={restaurant?.image_url}
            alt={restaurant?.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 rounded-xl"></div>
        )}

        <div className="absolute top-0 left-0 w-full h-full rounded-xl backdrop-blur-[6px]"></div>

        {restaurant && (
          <div className="absolute bottom-3 left-3 p-2">
            <h2 className="text-3xl font-extrabold text-white">
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

      <div className="mt-5 py-4">
        <h4 className="text-xl font-semibold">Highlights</h4>

        <div className="my-4 flex items-center gap-4 overflow-auto w-full">
          {highlights.map((highlight, index) => (
            <HighlightCard key={index} {...highlight} />
          ))}
        </div>
        <Menu menu={menu_items} />
      </div>

      <div className="flex flex-col gap-3 w-96">
        <button
          className="p-2 bg-red-600 text-white rounded-lg"
          onClick={() => process_reviews(API_KEY, reviews)}
        >
          Process Reviews
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
    </div>
  );
};

export default Restaurant;
