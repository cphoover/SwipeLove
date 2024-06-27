import { v4 as uuidv4 } from "uuid";
import { format, parseISO } from "date-fns";

export const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("userId", userId);
  }
  return userId;
};

export const isRecentUpdate = (obj) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const createdAt = new Date(obj.created_at);
  const updatedAt = new Date(obj.updated_at);
  return createdAt > fiveMinutesAgo || updatedAt > fiveMinutesAgo;
};

export const formatLastUpdatedTime = (data) => {
  const timestamp = data.updated_at || data.created_at;
  const date = parseISO(timestamp);
  return format(date, "h:mmaaaa").replace("a.m.", "am").replace("p.m.", "pm"); // 'h:mm aaaa' is the format string for "hour:minute AM/PM"
};

export const getMapMarker = (category) => {
  // switch (category) {
  //   case "Bar":
  //     return "/images/vector-markers/bar.svg";
  //   case "Restaurant":
  //     return "/images/vector-markers/food.svg";
  //   case "Brewery":
  //     return "/images/vector-markers/bar.svg";
  //   case "Marketplace":
  //     return "/images/vector-markers/market.svg";
  //   case "Pizza":
  //     return "/images/vector-markers/pizza.svg";
  //   default:
  //     return "/images/markers/default.svg";
  // }

  switch (category) {
    case "Bar":
      return "images/vector-markers/bar-rounded.svg";
    case "Restaurant":
      return "images/vector-markers/food-rounded.svg";
    case "Brewery":
      return "images/vector-markers/beer-rounded.svg";
    case "Marketplace":
      return "images/vector-markers/market-rounded.svg";
    case "Pizza":
      return "images/vector-markers/pizza-rounded.svg";
    case "Coffee Shop":
      return "images/vector-markers/coffee-rounded.svg";
    default:
      return "images/markers/default.svg";
  }
};

// export const getMapMarker = (category) => {

//   switch (category) {
//     case 'Bar':
//       return '/images/vector-markers/bar.svg';
//     case 'Restaurant':
//       return '/images/vector-markers/food.svg';
//     case 'Brewery':
//       return '/images/vector-markers/bar.svg';
//     case 'Marketplace':
//       return '/images/vector-markers/market.svg';
//     case 'Pizza':
//       return '/images/vector-markers/pizza.svg';
//     default:
//       return '/images/markers/default.svg';
//   }
// }

export function getResizedURL(seedURL, { width, height }) {
  const url = new URL(seedURL);
  url.searchParams.set("width", width);
  url.searchParams.set("height", height);
  return url.toString();
}

export function calculateAge(birthDateString) {
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate)) {
    throw new Error("Invalid date format. Please use 'YYYY-MM-DD'");
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export const debug = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};
