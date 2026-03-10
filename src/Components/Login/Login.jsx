import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { LuEyeOff } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { authContext } from "../../Context/authContext";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const registerSchema = zod.object({
  email: zod
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address (e.g. name@example.com)"),
  password: zod
    .string()
    .nonempty("Password is required")
    .regex(
      passwordRegex,
      "Password must be 8+ characters with uppercase, lowercase, and a number.",
    ),
});

export default function Login() {
  const [LoginStatus, setLoginStatus] = useState("idle");
  const [isPasswordInput, setIsPasswordInput] = useState(true);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const { setAuthenticatedUserToken } = useContext(authContext);

  //ah12345@ua.com
  // Ah123456@

  const { register, handleSubmit, formState } = form;

  function handleRegister(userData) {
    setLoginStatus("loading");
    axios
      .post("https://route-posts.routemisr.com/users/signin", userData)
      .then((response) => {
        const tkn = response.data.data.token;
        setLoginStatus("success");
        setAuthenticatedUserToken(tkn);
        localStorage.setItem("userToken", tkn);
        setTimeout(() => navigate("/home"), 2500);
      })
      .catch((error) => {
        const errorMsg = error.response.data.message;
        setLoginStatus(errorMsg);
      })
      .finally(() => {
        setTimeout(() => setLoginStatus("idle"), 2500);
      });
  }

  return (
    <>
      <h1 className="text-center text-5xl font-bold text-brand-light py-8">
        Login
      </h1>

      {LoginStatus == "success" && (
        <div className="bg-green-600 text-white text-center p-2 max-w-md mx-auto mb-10 rounded-[10px]">
          Login success!
        </div>
      )}
      {LoginStatus != "idle" &&
        LoginStatus !== "loading" &&
        LoginStatus !== "success" && (
          <div className="bg-red-600 text-white text-center p-2 max-w-md mx-auto mb-10 rounded-[10px]">
            {LoginStatus}
          </div>
        )}

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="max-w-md mx-auto"
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("email")}
            type="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Email
          </label>
          {formState.errors.email && formState.touchedFields.email && (
            <p className="text-red-600 text-sm">
              {formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("password")}
            type={isPasswordInput ? "password" : "text"}
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer relative"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Password
          </label>
          <span className="absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer">
            {isPasswordInput ? (
              <LuEye onClick={() => setIsPasswordInput(false)} />
            ) : (
              <LuEyeOff onClick={() => setIsPasswordInput(true)} />
            )}
          </span>
          {formState.errors.password && formState.touchedFields.password && (
            <p className="text-red-600 text-sm">
              {formState.errors.password.message}
            </p>
          )}
        </div>
        {LoginStatus === "loading" ? (
          <button
            disabled
            type="button"
            className="text-whit flex justify-center items-center bg-gray-600 hover:bg-gray-500 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full cursor-not-allowed"
          >
            <RotatingLines
              visible={true}
              height="24"
              width="24"
              color="white"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </button>
        ) : (
          <button
            type="submit"
            className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full cursor-pointer"
          >
            Login
          </button>
        )}
        <p className="text-sm text-gray-600 font-medium mt-3">
          Don't have an account yet?{" "}
          <Link to={"/register"} className="text-brand-light">
            Register now
          </Link>
        </p>
      </form>
    </>
  );
}
