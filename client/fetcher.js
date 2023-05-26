import axios from "axios";

// axios의 baseURL에 정보를 입력.
// 이후로는 route만 적어도 된다.
axios.defaults.baseURL = "http://localhost:8000";

// axios를 편하게 쓰기 위해 만든 함수
// (MsgList 컴포넌트에서 사용)
// post, put의 경우 data를 추가해서 넘겨줘야 하기 때문에 미리 고려해서 rest parameter로 두었다.
const fetcher = async (method, url, ...rest) => {
  const res = await axios[method](url, ...rest);
  return res.data;
};

export default fetcher;
/**
 * axios 사용법
 *
 * get: axios.get(url[, config])
 * delete: axios.delete(url[, config])
 * post: axios.post(url, data[, config])
 * put: axios.post(url, data[, config])
 */
