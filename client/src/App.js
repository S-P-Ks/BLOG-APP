import { useState, useEffect, useRef } from "react";
import Navbar from "./components/navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/myBlogs";
import MyBlogs from "./pages/myBlogs";
import NewBlog from "./pages/newBlog";
import BlogDetails from "./pages/BlogDetails";
import { Toaster } from "react-hot-toast";
import { getProfile } from "./API/auth.js";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "./store/auth.js";

function App() {
  const [isLoading, setisLoading] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // console.log(auth.user);

  const getUser = () => {
    setisLoading(true);

    getProfile(
      (data) => {
        dispatch(setCredentials(data));
      },
      (err) => {
        console.log(err);
      },
      () => {
        setisLoading(false);
      }
    );
  };

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      getUser();
    }
  }, []);

  if (isLoading && !initialized.current) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  // console.log(auth);

  return (
    <div className="p-2 font-poppins grid grid-cols-12 w-full gap-2 min-h-screen max-h-screen bg-blue-600">
      <div className="col-span-3">
        <Navbar />
      </div>
      <div
        className="col-span-9 bg-blue-950 rounded-lg text-white overflow-hidden"
        style={{ maxHeight: "100%" }}
      >
        <Toaster position="top-right" />

        <Routes>
          <Route
            exact
            path="/"
            element={auth.user ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route exact path="/login" element={<Login />} />
          <Route
            exact
            path="/myblogs"
            element={auth.user ? <MyBlogs /> : <Navigate to={"/login"} />}
          />
          <Route
            exact
            path="/newblog"
            element={auth.user ? <NewBlog /> : <Navigate to={"/login"} />}
          />
          <Route
            exact
            path="/blog/:id"
            element={auth.user ? <BlogDetails /> : <Navigate to={"/login"} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
