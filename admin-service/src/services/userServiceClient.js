const axios = require("axios");

const userServiceClient = axios.create({
  baseURL: process.env.USER_SERVICE_URL,
  timeout: 5000,
  headers: {
    "x-internal-api-key":
      process.env.USER_SERVICE_INTERNAL_API_KEY,
  },
});

module.exports = userServiceClient;