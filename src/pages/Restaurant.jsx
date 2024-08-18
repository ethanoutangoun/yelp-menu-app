import { useParams } from "react-router-dom";
import { restaurant_data, processed_reviews, menu_items } from "../mockdata";
import { useState, useEffect } from "react";
import { process_reviews } from "../utils";
import Menu from "../components/Menu";

const Restaurant = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [mockReviews, setMockReviews] = useState([]);
  const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;

  
  // Extract and transform the reviews data on mount
  useEffect(() => {
    // Extract and transform the reviews data on mount
    const transformedReviews = restaurant_data[0].reviews.map(
      ({ comment, rating }) => ({
        comment: comment.text,
        rating,
      })
    );

    // Update the state with the transformed reviews
    setReviews(transformedReviews);
    setMockReviews(transformedReviews.slice(8, 11));

    // Log the transformed data
    // console.log(transformedReviews);
  }, []);

  return (
    <div className="my-10 min-h-[83vh]">
      <p>{id}</p>

      <div className="flex flex-col gap-3 w-96">

     
      <button className="p-2 bg-red-600 text-white rounded-lg" onClick={() => process_reviews(API_KEY, reviews)}>
        Process Reviews
      </button>

      <button className="p-2 bg-red-600 text-white rounded-lg"  onClick={() => console.log(processed_reviews)}>
        Log processed reviews
      </button>

      <button className="p-2 bg-red-600 text-white rounded-lg"  onClick={() => console.log(menu_items)}>
        Log menu
      </button>
      </div>

      <div className="mt-10 py-4">
        <Menu menu = {menu_items} />
      </div>
    </div>
  );
};

export default Restaurant;
