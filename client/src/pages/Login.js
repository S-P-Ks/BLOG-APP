import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { logout } from "../API/auth";
import { useDispatch, useSelector } from "react-redux";
import { useSignUpMutation, useLoginMutation } from "../store/authApiSlice.js";
import { setCredentials } from "../store/auth.js";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Cookie from "js-cookie";

function Login() {
  const [isLogin, setisLogin] = useState(true);

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const [cookies, setCookie, removeCookie] = useCookies();

  console.log(cookies);

  const navigate = useNavigate();

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [signUp, { isSignupLoading }] = useSignUpMutation();
  const [login, { isLoginLoading }] = useLoginMutation();

  const emailLogin = async (body) => {
    console.log(process.env.REACT_APP_API_URL);
    // e.preventDefault();

    try {
      const res = await login(body).unwrap();
      dispatch(setCredentials({ ...res }));

      toast.success("Login Successful!");
    } catch (error) {
      console.log(error);
      toast.error("Somthing went wrong!");
    }
  };

  const handlesignUp = async (body) => {
    try {
      const res = await signUp(body).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Sign Up successfull!");
    } catch (error) {
      toast.error("Somthing went wrong!");
    }
  };

  const submit = async () => {
    try {
      if (email.length == 0 || password.length == 0) {
        toast.error("Please enter all the values!");
        return;
      }

      if (!isLogin && username.length == 0) {
        toast.error("Please enter all the values!");
        return;
      }

      if (!isValidEmail(email)) {
        toast.error("Please enter valid email !");
        return;
      }

      const body = {};

      if (username.length != 0) {
        body["username"] = username;
      }

      if (email.length != 0) {
        body["email"] = email;
      }

      if (password.length != 0) {
        body["password"] = password;
      }

      // console.log(body);

      if (isLogin) {
        emailLogin(body);
      } else {
        handlesignUp(body);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const deleteCookie = () => {};

  console.log(auth);

  if (!!auth.user) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div
          className="text-2xl text-white bg-green-600 p-2 rounded-lg"
          onClick={async () =>
            await logout()
              .then((r) => {
                // console.log(``);
                Cookie.remove("jwt", {
                  path: "/",
                  domain: "http://localhost:3000",
                });
                navigate(0);
              })
              .catch((err) => {
                console.log(err);
                toast.error("Something went wrong!");
              })
              .finally(() => {
                // navigate(0);
              })
          }
        >
          Log Out
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 flex flex-col justify-center items-center">
      <div className="mb-4">{isLogin ? "Login Form" : "Sign up Form"}</div>

      <div className="flex flex-col justify-center items-center w-1/2">
        {!isLogin ? (
          <div className="flex flex-col mb-2 mr-2 w-full">
            <label htmlFor="title">Username</label>
            <input
              className="rounded-lg p-2 mt-2 bg-black ml-1"
              type="username"
              name="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex flex-col mb-2 mr-2 w-full">
          <label htmlFor="Description">Email</label>
          <input
            className="rounded-lg p-2 mt-2 bg-black ml-1"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
        <div className="flex flex-col mb-2 mr-2 w-full">
          <label htmlFor="Description">Password</label>
          <input
            className="rounded-lg p-2 mt-2 bg-black ml-1"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>

        <div className="flex justify-self-start w-full">
          {isLogin ? "Create new user ? " : "Already a user ? "}
          {"   "}
          <div
            className="cursor-pointer hover:text-blue-500"
            onClick={() => {
              setisLogin(!isLogin);
              setusername("");
              setemail("");
              setpassword("");
            }}
          >
            {isLogin ? "Sign up" : " Login"}
          </div>
        </div>
      </div>

      <div
        className="mt-2 p-2 bg-green-500 rounded-lg cursor-pointer"
        onClick={submit}
      >
        {isLogin ? "Login" : "Signup"}
      </div>
    </div>
  );
}

export default Login;
