import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col justify-between bg-slate-900 text-white p-2 rounded-lg h-full">
      <div>
        <div className="p-2 font-semibold font text-2xl mb-10">Blog Post</div>
        <div>
          <Link to={"/"}>
            <div className="hover:bg-slate-700 p-2 rounded-lg">Explore</div>
          </Link>
          <Link to={"/myblogs"}>
            <div className="hover:bg-slate-700 p-2 rounded-lg">My Blogs</div>
          </Link>
          <Link to={"/login"}>
            <div className="hover:bg-slate-700 p-2 rounded-lg">
              {auth.user ? "Logout" : "Login/SignUp"}
            </div>
          </Link>
        </div>
      </div>

      <div className="p-2 font-semibold font text-base">
        Created by Shubham Kumbhare
      </div>
    </div>
  );
}

export default Navbar;
