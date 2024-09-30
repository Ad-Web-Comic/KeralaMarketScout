// index.js

import { ApifyClient } from 'apify-client';

/**
 * KeralaMarketScout Module
 * This module helps digital marketers find potential clients in Kerala based on industry and location.
 * 
 * @param {Array} searchStringsArray - Array of business types to search for (e.g., ["restaurant", "marketing agency"])
 * @param {string} locationQuery - Location for the search (e.g., "Kerala, India")
 * @param {number} maxResults - Maximum number of results to fetch
 * @param {string} language - Language of the results (default: "en")
 * @param {number} minStars - Minimum rating of businesses to include (optional)
 * @param {boolean} skipClosed - Skip closed businesses
 * 
 * @returns {Array} List of business objects containing name, location, rating, and contact details
 */
const KeralaMarketScout = async ({
    searchStringsArray = ["restaurant"],
    locationQuery = "Kerala, India",
    maxResults = 50,
    language = "en",
    minStars = 0,
    skipClosed = true,
}) => {
    // Initialize the ApifyClient with API token
    const client = new ApifyClient({
        token: process.env.APIFY_API_TOKEN, // Make sure to use environment variable for security
    });

    // Prepare input for the API
    const input = {
        searchStringsArray,
        locationQuery,
        maxCrawledPlacesPerSearch: maxResults,
        language,
        deeperCityScrape: false,
        searchMatching: "all",
        placeMinimumStars: minStars.toString(), // convert to string as required by API
        skipClosedPlaces: skipClosed
    };

    try {
        // Run the Apify actor to fetch business data
        const run = await client.actor("2Mdma1N6Fd0y3QEjR").call(input);

        // Get results from Apify dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        // Process and return results
        return items.map(item => ({
            name: item.name,
            address: item.location,
            rating: item.rating,
            phone: item.phone,
            website: item.website
        }));

    } catch (error) {
        console.error('Error fetching data from Apify:', error);
        throw new Error('Failed to retrieve data.');
    }
};

export default KeralaMarketScout;
