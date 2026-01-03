import axios from "axios";
import { mockReviews } from "../mockReviews.js";

const API_TOKEN = import.meta.env.VITE_APIFY_KEY;
const ACTOR_ID = "nwua9Gu5YrADL7ZDj";

export async function getReviewsMock(placeId) {
    console.log("Using mock reviews for placeId:", placeId);
    return mockReviews;
}

// TESTING
export async function getReviews(placeId) {
  const input = {
    includeWebResults: false,
    language: "en",
    maxCrawledPlacesPerSearch: 1,
    maxImages: 0,
    maxReviews: 100,
    maximumLeadsEnrichmentRecords: 0,
    placeIds: [placeId],
    scrapeContacts: false,
    scrapeDirectories: false,
    scrapeImageAuthors: false,
    scrapePlaceDetailPage: false,
    scrapeReviewsPersonalData: false,
    scrapeSocialMediaProfiles: {
      facebooks: false,
      instagrams: false,
      tiktoks: false,
      twitters: false,
      youtubes: false,
    },
    scrapeTableReservationProvider: false,
    skipClosedPlaces: false,
    searchMatching: "all",
    placeMinimumStars: "",
    website: "allPlaces",
    maxQuestions: 0,
    reviewsSort: "mostRelevant",
    reviewsFilterString: "",
    reviewsOrigin: "all",
    allPlacesNoSearchAction: "",
  };

  console.log("Starting actor run for placeId:", placeId);
  // 1. Start actor run
  const runRes = await axios.post(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs`,
    input,
    {
      params: { token: API_TOKEN },
      headers: { "Content-Type": "application/json" },
    }
  );

  const runId = runRes.data.data.id;
  const datasetId = runRes.data.data.defaultDatasetId;

  // 2. Poll dataset (actor is async)
  await waitForDataset(datasetId);

  // 3. Fetch results
  const itemsRes = await axios.get(
    `https://api.apify.com/v2/datasets/${datasetId}/items`,
    {
      params: {
        token: API_TOKEN,
        clean: true,
      },
    }
  );

  const reviews = itemsRes.data?.[0].reviews.map((review) => ({
    text: review.text,
    rating: review.stars,
  }));

  return reviews;
}

async function waitForDataset(datasetId, retries = 20) {
  for (let i = 0; i < retries; i++) {
    const res = await axios.get(
      `https://api.apify.com/v2/datasets/${datasetId}`,
      { params: { token: API_TOKEN } }
    );

    if (res.data.data.itemCount > 0) return;
    await new Promise((r) => setTimeout(r, 3000));
  }

  throw new Error("Dataset not ready in time");
}
