import { useParams } from "react-router-dom";
import { restaurant_data, processed_reviews } from "../mockdata";
import { useState, useEffect } from "react";
import { process_review, process_reviews } from "../utils";

const Restaurant = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [mockReviews, setMockReviews] = useState([]);
  const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;

  const mockReview =
    'This was highly recommended by a colleague who is Vietnamese. We came here especially for their pho bo tai - the Vietnamese national dish of flat rice noodles served in a light but rich tasting meaty broth with slices of raw beef, accompanied by lots of fresh herbs, bean sprouts and lemon. We came here on a night when they were also serving a slightly different version of pho, pronounced a bit like "bom buoy wei", which mainly differs in the broth. I was also pleasantly surprised that they have this amazing starter called bahn cuon - lightly steamed rice sheets filled with minced pork and fungus and served with bean sprouts, crispy onions and fish sauce. This is usually a tricky dish to make as it has to be prepared fresh, which this restaurant did perfectly! I would definitely come again and would like to rate it higher as I think we caught them on a busier than usual day!';

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
    console.log(transformedReviews);
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
      </div>
    </div>
  );
};

export default Restaurant;
