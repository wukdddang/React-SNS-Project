import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

const fetcher = async (method, url, ...rest) => {
  const res = await axios[method](url, ...rest);
  return res.data;
};

export default fetcher;
/**
 * axios 사용법
 * get: axios.get(url[, config])
 * delete: axios.delete(url[, config])
 * post: axios.post(url, data[, config])
 * put: axios.post(url, data[, config])
 */
