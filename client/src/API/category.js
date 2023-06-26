import axios from "axios";

export const getAllCategories = (page, limit, onSuccess, onError) => {
  axios
    .get(
      `${process.env.REACT_APP_API_URL}/categories?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    )
    .then(({ data }) => onSuccess(data))
    .catch((err) => onError(err));
};

export const createCategory = (body, onSuccess, onError) => {
  return axios
    .post(`${process.env.REACT_APP_API_URL}/categories`, body, {
      withCredentials: true,
    })
    .then(({ data }) => onSuccess(data))
    .catch((err) => onError(err));
};
