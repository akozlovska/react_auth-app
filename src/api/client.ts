import axios from "axios";

export const createClient = () => {
  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
  });
}
