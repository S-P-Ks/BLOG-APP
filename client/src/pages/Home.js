import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { getAllPosts, getPostById, likePost } from "../API/post.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import auth from "../store/auth";
import { useSelector } from "react-redux";

function Home() {
  const [isLoading, setisLoading] = useState(false);

  const [posts, setposts] = useState([]);
  const [totalCount, settotalCount] = useState(100);
  const [page, setpage] = useState(1);
  const limit = 10;

  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const getPosts = async () => {
    setisLoading(true);
    await getAllPosts(page, limit)
      .then(({ data }) => {
        setposts([...posts, ...data.data]);
        settotalCount(data.total_count);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  if (posts.length == 0) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="text-2xl text-white">
          There are no posts currently available!
        </div>
      </div>
    );
  }

  console.log(auth.user._id);

  return (
    <div
      className="p-4 overflow-hidden scrollbar-thick scrollbar-thumb-blue-500 scrollbar-track-blue-100"
      style={{ height: "95vh", maxHeight: "95vh" }}
    >
      Explore
      <div className="overflow-y-scroll h-full mt-2">
        <div className="flex flex-wrap">
          {posts.map((el) => {
            // console.log(el);
            return (
              <BlogCard
                key={el._id}
                id={el._id}
                title={el.title}
                createdAt={
                  new Date(el.updated_at).getDate() +
                  " " +
                  new Date(el.updated_at).toLocaleString("default", {
                    month: "long",
                  }) +
                  " " +
                  new Date(el.updated_at).getFullYear()
                }
                imgURL={el.imageUrl}
                onClick={() => navigate(`/blog/${el._id}`)}
                isSelected={el.likes.includes(auth.user._id)}
                categories={el.categories}
                author={el.author.username}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
