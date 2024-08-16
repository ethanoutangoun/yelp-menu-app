import { useParams } from "react-router-dom";
import { restaurant_data } from "../mockdata";
import { useState, useEffect } from "react";

const Restaurant = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);


  const ROLE = `I will give you a review, your goal is to extract the menu item as best you can and based on sentiment, rate what the user said about it from 1-5, 5 being the best. Rate menu items based on their specific sentiment in the review. If a review indicates significant disappointment or a horrible experience, rate those items as 1. A rating of 2 means it was unpleasant but still not the worst. A rating of three means okay. A rating of 4 means it was enjoyable, but could be better. Please respond in json with menu_item and rating as the object attributes. If multiple items mentioned, return a list of objects.do not rate relative to other items unless explicitly mentioned. Try to name the menu item just as it would be named in an actual menu, and not just a substring of the review. If no specific menu items are mentioned, return an empty list. Do not provide explanations.`

  // Extract and transform the reviews data on mount
  useEffect(() => {
    // Extract and transform the reviews data on mount
    const transformedReviews = restaurant_data[0].reviews.map(({ comment, rating }) => ({
      comment: comment.text,
      rating,
    }));
  
    // Update the state with the transformed reviews
    setReviews(transformedReviews);
  
    // Log the transformed data
    console.log(transformedReviews);
  }, []);


  return (
    <div>
      <p>{id}</p>
    </div>
  );
};

export default Restaurant;
