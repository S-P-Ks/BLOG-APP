import React from "react";
import { BiLike } from "react-icons/bi";
import { AiTwotoneLike } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { likePost } from "../API/post.js";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

function BlogCard({
  id,
  title,
  createdAt,
  imgURL,
  onClick,
  isSelected,
  categories = [],
  author,
}) {
  const t = title.length;

  const [isLiked, setisLiked] = useState(isSelected);
  const auth = useSelector((state) => state.auth);

  if (t > 50) {
    title = title.substring(0, 40) + "...";
  }

  const likePostDetails = async () => {
    await likePost(
      id,
      auth.user._id,
      (res) => {
        setisLiked(!isLiked);
      },
      (err) => {
        console.log(err);
        toast.error("Something went wrong!");
      },
      () => {}
    );
  };

  let length = categories.length;
  let cat = categories;
  if (categories.length > 2) {
    cat = categories.slice(0, 2);
  }

  return (
    <div
      className="rounded-lg m-2 h-72 overflow-hidden bg-black hover:bg-slate-900 w-48 relative"
      onClick={() => onClick()}
    >
      <div
        className={`w-10 h-10 ${
          isLiked ? `bg-green-600` : `bg-blue-400`
        } absolute rounded-full right-2 top-2 flex justify-center items-center`}
        onClick={(e) => {
          e.stopPropagation();
          likePostDetails();
        }}
      >
        {!isLiked ? <BiLike size={20} /> : <AiTwotoneLike />}
      </div>
      <div
        className="h-1/2 overflow-hidden object-cover bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url(${imgURL})` }}
      ></div>
      <div className="p-2 flex flex-col">
        <div className="flex mb-2 items-start">
          {categories.map((el) => (
            <div
              key={Math.random()}
              className="p-1 mr-1 rounded-lg bg-zinc-700 text-xs"
            >
              {el.title}
            </div>
          ))}
          {length > 2 && <div>{`+${length - 2}`}</div>}
        </div>
        <div className="items-end">
          <div className="overflow-ellipsis">{title}</div>
          <div className="text-gray-400">By {author}</div>
          <div className="text-gray-500">{createdAt}</div>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
