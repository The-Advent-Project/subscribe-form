const axios = require("axios");
const apiKey = process.env.SENDY_API_KEY;

exports.handler = async (event, context) => {
  // Get fields from front-end
  let data = JSON.parse(event.body);

  // POST as x-www-form-urlencoded
  const params = new URLSearchParams();
  params.append("name", data.name);
  params.append("email", data.email);
  if (data.preferredName) {
    params.append("PreferredName", data.preferredName);
  }
  if (data.notifications !== "") {
    params.append("Keyholder2024", "yes");
    params.append("Notifications", data.notifications);
  }
  params.append("list", "yxWKzjm4jwh5Q2WXB0tOHw");
  params.append("boolean", "true");
  params.append("api_key", apiKey);

  // Attempt API call to Sendy
  let frontEndResponse = {};
  try {
    const response = await axios.post(
      "https://sendy.adventproject.org/subscribe",
      params
    );
    let statusCode = null,
      success = null;
    console.log("Sendy response:", response.data);
    if (
      response.data !== "true" &&
      response.data !== 1 &&
      response.data !== true
    ) {
      // Connected successfully but Sendy threw an error
      success = false;
      statusCode = 400;
    } else {
      // Everything worked great
      success = true;
      statusCode = 200;
    }
    // Pass response to front end
    frontEndResponse.statusCode = statusCode;
    frontEndResponse.body = JSON.stringify({
      success: success,
      message: response.data,
    });
  } catch (error) {
    // Connection error
    frontEndResponse.statusCode = 500;
    frontEndResponse.body = JSON.stringify({
      // the useful data for the front-end app
      success: false,
      message: "An error occurred connecting to Sendy.",
    });
  }

  return JSON.parse(JSON.stringify(frontEndResponse));
};
