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

  const ROLE = `I will give you a review, your goal is to extract the menu item as best you can and based on sentiment, rate what the user said about it from 1-5, 5 being the best. Rate menu items based on their specific sentiment in the review. If a review indicates significant disappointment or a horrible experience, rate those items as 1. A rating of 2 means it was unpleasant but still not the worst. A rating of three means okay. A rating of 4 means it was enjoyable, but could be better. Please respond in json with menu_item and rating as the object attributes. If multiple items mentioned, return a list of objects.do not rate relative to other items unless explicitly mentioned. Try to name the menu item just as it would be named in an actual menu, and not just a substring of the review. If no specific menu items are mentioned, return an empty list. Do not provide explanations and return raw json without markdown syntax. Example output: 
  
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
    console.log(res);
    return res;
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Processes multiple reviews and returns the extracted menu items and their ratings
export async function process_reviews(apiKey, reviews) {
  let results = [];
  const weighted = false;

  for (const review of reviews) {
    const message = review.comment;
    const rating = review.rating;
    console.log(`Processing review ${reviews.indexOf(review)}`);

    const res = await process_review(apiKey, message);

    console.log(res.length);

    if (res.length > 0) {
      if (weighted) {
        res.forEach((item) => {
          item.rating = (item.rating + rating) / 2;
        });
      }
      // Flatten the array using the spread operator
      results.push(...res);
    }

    console.log(results);
  }
}
