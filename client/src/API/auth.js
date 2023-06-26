import axios from "axios";

export const login = (body) => {
  //   console.log(process.env.REACT_APP_API_URL);
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, body);
};

export const logout = () => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
};

export const signup = (body) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, body);
};

export const getProfile = (onSuccess, onError, onFinally) => {
  axios
    .get(`${process.env.REACT_APP_API_URL}`, { withCredentials: true })
    .then(({ data }) => onSuccess(data))
    .catch((err) => onError(err))
    .finally(onFinally);
};
