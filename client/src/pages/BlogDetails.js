import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostById, likePost, deletePost } from "../API/post.js";
import { BiLike } from "react-icons/bi";
import { AiTwotoneLike } from "react-icons/ai";
import { RxUpdate } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import auth from "../store/auth.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function BlogDetails() {
  const { id } = useParams();

  const [imageUrl, setimageUrl] = useState("");
  const [content, setcontent] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [categories, setcategories] = useState([]);
  const [likes, setlikes] = useState([]);
  const [updatedAt, setupdatedAt] = useState("");
  const [author, setauthor] = useState(null);

  const [isLiked, setisLiked] = useState(false);

  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState(false);

  const auth = useSelector((state) => state.auth);

  const naviagte = useNavigate();

  const getPostDetails = async () => {
    setisLoading(true);

    await getPostById(
      id,
      (res) => {
        console.log(res.imageUrl);
        setcategories([...res.categories]);
        settitle(res.title);
        setdescription(res.description);
        setcontent(res.content);
        setlikes([...res.likes]);
        setimageUrl(res.imageUrl);
        setupdatedAt(res.updated_at);

        // console.log(res.author);
        setauthor(res.author);
        setisLiked(res.likes.includes(auth.user._id));
      },
      (err) => {
        console.log(err);
        seterror(true);
      },
      () => {
        setisLoading(false);
      }
    );
  };

  const likePostDetails = async () => {
    setisLoading(true);

    await likePost(
      id,
      auth.user._id,
      (res) => {
        setisLiked(!isLiked);
      },
      (err) => {
        console.log(err);
        seterror(true);
      },
      () => {
        setisLoading(false);
      }
    );
  };

  const deletePostDetails = async () => {
    setisLoading(true);

    await deletePost(
      id,
      auth.user._id,
      (res) => {
        naviagte("/myblogs");
      },
      (err) => {
        console.log(err);
        seterror(true);
      },
      () => {
        setisLoading(false);
      }
    );
  };

  useEffect(() => {
    getPostDetails();
  }, []);

  if (error) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="text-2xl text-red-900">Something went wrong!</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  console.log(author);

  return (
    <div
      className="p-4 overflow-hidden rounded-lg"
      style={{ height: "95vh", maxHeight: "95vh" }}
    >
      <div className="bg-white overflow-y-scroll h-full rounded-lg">
        <div className="rounded-lg text-black p-2">
          <div
            className="h-80 overflow-hidden object-cover bg-no-repeat bg-center bg-cover relative "
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <div className="absolute bottom-2 left-2 bg-black p-2 rounded-lg">
              <div className=" text-white text-md font-medium  mb-2">
                Last updated at :{" "}
                {new Date(updatedAt).getDate() +
                  " " +
                  new Date(updatedAt).toLocaleString("default", {
                    month: "long",
                  }) +
                  " " +
                  new Date(updatedAt).getFullYear()}
              </div>
              <div className=" text-white text-xl font-bold ">{title}</div>
              {author && (
                <div className="text-white">{`By ${author.username}`}</div>
              )}
            </div>

            {auth.user._id && author != null && author._id == auth.user._id ? (
              <div className="absolute top-2 right-2 flex">
                <div
                  className={`w-10 h-10 ${
                    isLiked ? `bg-green-600` : `bg-blue-400`
                  } rounded-full flex justify-center items-center mr-2`}
                  onClick={() => likePostDetails()}
                >
                  {!isLiked ? <BiLike size={20} /> : <AiTwotoneLike />}
                </div>

                <div
                  className={`w-10 h-10 ${`bg-green-600`} rounded-full flex justify-center items-center mr-2`}
                  onClick={() => {
                    naviagte(`/newblog?isUpdate=${true}&blog_id=${id}`);
                  }}
                >
                  <RxUpdate size={20} />
                </div>

                <div
                  className={`w-10 h-10 ${`bg-red-500`} rounded-full flex justify-center items-center`}
                  onClick={() => deletePostDetails()}
                >
                  <MdDelete size={20} />
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="flex mt-2">
            {categories.length > 0 &&
              categories.map((el) => (
                <div
                  key={Math.random()}
                  className="p-2 mr-1 rounded-lg bg-zinc-700 text-xs text-white"
                >
                  {el.title}
                </div>
              ))}
          </div>
          <div className="mt-2">
            <div className="rounded-lg bg-blue-950 p-2 text-white">
              {description}
            </div>
          </div>
          <div
            className="p-2"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
