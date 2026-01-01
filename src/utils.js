import axios from "axios";
const API_KEY = import.meta.env.VITE_OPEN_AI_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const SERP_API_KEY = import.meta.env.VITE_SERP_API_KEY;
const PROD = import.meta.env.VITE_PROD;


// Processes an individual review and returns the extracted menu items and their ratings
export async function process_review(apiKey, review) {
  if (!apiKey) {
    console.error("Please provide your OpenAI API key");
    return;
  }

  if (!review) {
    console.error("Please provide a review to process");
    return;
  }

  const ROLE = `I will give you a review, your goal is to extract the menu item as best you can and based on sentiment, rate what the user said about the taste from 1-5, 5 being the best. Rate menu items based on their specific sentiment in the review, and only judge on the quality of the dish, not the price or service. If a review indicates significant disappointment or a horrible experience, rate those items as 1. A rating of 2 means it was unpleasant but still not the worst. A rating of three means okay. A rating of 4 means it was enjoyable, but could be better. Please respond in json with menu_item and rating as the object attributes. If multiple items mentioned, return a list of objects.do not rate relative to other items unless explicitly mentioned. Try to name the menu item just as it would be named in an actual menu, and not just a substring of the review. If no specific menu items are mentioned, return an empty list. Do not provide explanations and return raw json without markdown syntax. Example output: 
  
  [
    {
        "menu_item": "Pho Bo Tai",
        "rating": 4
    },
    {
        "menu_item": "Banh Cuon",
        "rating": 5
    }
]`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Specify the model
        messages: [
          {
            role: "system",
            content: ROLE,
          },
          { role: "user", content: review },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Error:", response.status, response.statusText);
      const errorDetails = await response.json();
      console.error("Details:", errorDetails);
      return;
    }

    const data = await response.json();
    const res = JSON.parse(data.choices[0].message.content);
    // console.log(res);
    return res;
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Processes multiple reviews and returns the extracted menu items and their ratings
export async function process_reviews(apiKey, reviews) {
  if (reviews.length === 0) {
    console.error("Please provide reviews to process");
    return;
  }

  let results = [];
  const weighted = false;

  for (const review of reviews) {
    const message = review.comment;
    const rating = review.rating;
    // console.log(`Processing review ${reviews.indexOf(review)}`);

    const res = await process_review(apiKey, message);

    if (res.length > 0) {
      if (weighted) {
        res.forEach((item) => {
          item.rating = (item.rating + rating) / 2;
        });
      }
      // Flatten the array using the spread operator
      results.push(...res);
    }
  }

  return results;
}

export async function process_clusters(apiKey, reviews) {
  console.log("Processing clusters");
  if (reviews.length === 0) {
    console.error("Please provide reviews to process");
    return;
  }

  const ROLE =
    "given a menu in dictionary format, i want you to separate this further into categories that would be suitable for a restaurant menu. please output a list of json objects the category name and the list of dictionary items that correspond to this category. no formatting, just raw list of json.";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Specify the model
        messages: [
          {
            role: "system",
            content: ROLE,
          },
          { role: "user", content: JSON.stringify(reviews) },
        ],
        temperature: 0,
      }),
    });

    if (!response.ok) {
      console.error("Error:", response.status, response.statusText);
      const errorDetails = await response.json();
      console.error("Details:", errorDetails);
      return;
    }

    const data = await response.json();
    const res = JSON.parse(data.choices[0].message.content);
    console.log(res);
    return res;
  } catch (error) {
    console.error("Request failed:", error);
  }
}

export async function get_reviews(restaurantId) {
  let API_URL = `/serpapi/search.json?engine=yelp_reviews&place_id=${restaurantId}&api_key=${SERP_API_KEY}`;

  // if (PROD === "true") {
  //   API_URL = `https://serpapi.com/search.json?engine=yelp_reviews&place_id=${restaurantId}&api_key=${SERP_API_KEY}&async=true`;
  // }
  

  try {
    console.log("Fetching reviews");
    const response = await axios.get(API_URL);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Request failed:", error);
  }

 
}