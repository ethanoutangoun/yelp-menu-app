import axios from "axios";

const API_URL = 'http://127.0.0.1:3000/api/reviews/process';

export async function processReviews({ reviews, placeId }) {
  if (!reviews || reviews.length === 0) {
    console.error("Please provide reviews to process");
    return;
  }

  try {
    const payload = { placeId, reviews};
    const response = await axios.post(API_URL, payload);

    if (response.status !== 200) {
      console.error("Error:", response.status, response.statusText);
      return;
    }

    const res = response.data;
    console.log(res);
    return res;
  } catch (error) {
    console.error("Request failed:", error);
  }
}