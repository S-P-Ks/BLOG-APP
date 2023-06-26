import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getAllPostsByUserID } from "../API/post.js";
import { useNavigate } from "react-router-dom";

function MyBlogs() {
  const [isLoading, setisLoading] = useState(false);

  const [posts, setposts] = useState([]);
  const [totalCount, settotalCount] = useState(100);
  const [page, setpage] = useState(1);
  const limit = 10;

  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const getPosts = async () => {
    setisLoading(true);
    await getAllPostsByUserID(
      auth.user._id,
      page,
      limit,
      ({ data }) => {
        setposts([...posts, ...data.data]);
        settotalCount(data.total_count);
        setisLoading(false);
      },
      (err) => {
        console.log(err);
        toast.error(err.response.data.message);
        setisLoading(false);
      },
      () => {
        setisLoading(false);
      }
    );
  };

  useEffect(() => {
    if (auth.user != null) {
      getPosts();
    }
  }, [auth.user]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  // if (posts.length == 0) {
  //   return (
  //     <div className="h-full w-full flex justify-center items-center">
  //       <div className="text-2xl text-white">
  //         There are no posts currently available!
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      className="p-4 overflow-hidden scrollbar-thick scrollbar-thumb-blue-500 scrollbar-track-blue-100"
      style={{ height: "95vh", maxHeight: "95vh" }}
    >
      My Blogs
      <div className="mt-2 mb-2 flex">
        <Link to={"/newblog"}>
          <div className="hover:bg-pink-800 p-2 rounded-lg">
            + Create New Blog
          </div>
        </Link>
      </div>
      {posts.length <= 0 ? (
        <div className="h-full w-full flex justify-center items-center">
          <div className="text-2xl text-white">
            There are no posts currently available!
          </div>
        </div>
      ) : (
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
                  author={"you"}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBlogs;
