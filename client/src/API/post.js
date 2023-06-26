import axios from "axios";
import { toast } from "react-hot-toast";
import storage from "../config/firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const getAllPosts = (page, limit) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/posts?page=${page}&limit=${limit}`,
    {
      withCredentials: true,
    }
  );
};

export const getAllPostsByUserID = (
  id,
  page,
  limit,
  onSuccess,
  onError,
  onFinally
) => {
  axios
    .get(
      `${process.env.REACT_APP_API_URL}/posts?userId=${id}&page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    )
    .then((res) => onSuccess(res))
    .catch((err) => onError(err))
    .finally(() => onFinally());
};

export const getPostById = async (id, onSuccess, onError, onFinally) => {
  await axios
    .get(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
      withCredentials: true,
    })
    .then(({ data }) => onSuccess(data))
    .catch((err) => onError(err))
    .finally(() => onFinally());
};

export const likePost = async (id, userId, onSuccess, onError, onFinally) => {
  await axios
    .post(
      `${process.env.REACT_APP_API_URL}/posts/${id}/like/${userId}`,
      {},
      {
        withCredentials: true,
      }
    )
    .then(({ data }) => onSuccess(data))
    .catch((err) => onError(err))
    .finally(() => onFinally());
};

export const createPost = async (body, onSuccess, onError, onFinally) => {
  await axios
    .post(`${process.env.REACT_APP_API_URL}/posts/`, body, {
      withCredentials: true,
    })
    .then((res) => {
      onSuccess(res);
    })
    .catch((err) => onError(err))
    .finally(() => onFinally());
};

export const updatePost = async (id, body, onSuccess, onError, onFinally) => {
  await axios
    .put(`${process.env.REACT_APP_API_URL}/posts/${id}`, body, {
      withCredentials: true,
    })
    .then((res) => {
      onSuccess(res);
    })
    .catch((err) => onError(err))
    .finally(() => onFinally());
};

export const deletePost = async (id, onSuccess, onError, onFinally) => {
  await axios
    .delete(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
      onSuccess(res);
    })
    .catch((err) => onError(err))
    .finally(() => onFinally());
};

export const handleUpload = (file) => {
  console.log(`File 1 : ${file}`);
  return new Promise(function (resolve, reject) {
    if (!file) {
      toast.error("Please upload any image!");
    }

    console.log(`File : ${file}`);

    const storageRef = ref(storage, `/files/${file.name}`);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        // setPercent(percent);
      },
      (err) => reject(err),
      () => {
        // download url
        console.log(`Ref : ${uploadTask.snapshot.ref}`);
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(`URL : ${url}`);
          resolve(url);
        });
      }
    );
  });
};
