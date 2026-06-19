// src/hooks/useAxiosPublic.js
import axios from "axios";

export default () => {
  const axiosPublic = axios.create({
    baseURL: "http://localhost:5174/public/data/",
  });
  return axiosPublic;
};
