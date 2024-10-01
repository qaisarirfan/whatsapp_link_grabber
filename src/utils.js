import axios from "axios";
import Bottleneck from "bottleneck";
import { load } from "cheerio";

export const inviteLink = (link) => {
  if (!link) return null;
  if (link.includes("chat.whatsapp.com")) {
    const regex = /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{22}/gm;
    const result = link.replace("/invite", "");
    const group = result.match(regex);
    if (group) return group[0];
    return null;
  }
  return null;
};

export const isValidURL = (string) => {
  const res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g,
  );
  return res !== null;
};

export const isGoogle = (location) => {
  if (!location) return false;
  const url = new URL(location);
  return `${url?.origin}${url?.pathname}` === "https://www.google.com/search";
};

export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};

// eslint-disable-next-line no-promise-executor-return
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const parseUrl = (val) => {
  const parsedUrl = new URL(val);
  return {
    origin: parsedUrl.origin,
    href: parsedUrl.href,
  };
};

// Configure rate limiter (e.g., 5 requests per second)
export const limiter = new Bottleneck({
  maxConcurrent: 50, // Maximum concurrent requests
  minTime: 200, // Wait 200ms between each request
});

export const fetchData = async (url) => limiter.schedule(() => axios.get(url));

export const extractWhatsappLinks = (htmlContent) => {
  const waLinks = [];
  const $ = load(htmlContent);
  $("a").each((_, ele) => {
    const link = inviteLink($(ele).attr("href"));
    if (link) {
      waLinks.push(link);
    }
  });
  return [...new Set(waLinks)];
};

export const handleError = (error) => ({
  hasError: true,
  errorMessage: error.replace("AxiosError: ", ""),
});

export default {
  inviteLink,
  isValidURL,
  isGoogle,
  copyToClipboard,
  sleep,
};
