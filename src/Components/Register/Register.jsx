import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { authContext } from "../../Context/authContext";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const registerSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is required")
      .min(3, "Name should be minimum 3 chars")
      .max(14, "Name should be maximum 14 chars"),
    username: zod
      .string()
      .nonempty("username is required")
      .regex(
        /^[a-zA-Z0-9]{3,16}$/,
        "username must be 3–16 characters long and contain only letters and numbers (no spaces or special characters)",
      ),
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
    rePassword: zod.string().nonempty("Password confirmation is required"),
    dateOfBirth: zod.coerce
      .date("Invalid date")
      .refine(
        (date) =>
          new Date().getFullYear() - date.getFullYear() >= 18 &&
          new Date().getFullYear() - date.getFullYear() <= 85,
        "Invalid age, your age must be at least 18 and maximum 85",
      )
      .transform(
        (date) =>
          `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      ),
    gender: zod.enum(["male", "female"]),
  })
  .refine((userData) => userData.password === userData.rePassword, {
    path: ["rePassword"],
    message:
      "Passwords do not match. Please make sure both passwords are the same.",
  });

export default function Register() {
  const [registerStatus, setRegisterStatus] = useState("idle");
  const [isPasswordInput, setIsPasswordInput] = useState(true);
  const [isRePasswordInput, setIsRePasswordInput] = useState(true);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
  });

  const { setAuthenticatedUserToken } = useContext(authContext);

  const navigate = useNavigate();

  const { register, handleSubmit, formState } = form;

  function handleRegister(userData) {
    setRegisterStatus("loading");
    axios
      .post("https://route-posts.routemisr.com/users/signup", userData)
      .then((response) => {
        const token = response.data.data.token;
        console.log("response:", response);
        setRegisterStatus("success");
        setAuthenticatedUserToken(token);
        localStorage.setItem("userToken", token);
      })
      .catch((error) => {
        const errorMsg = error.response.data.errors;
        console.log("error:", error);
        setRegisterStatus(errorMsg);
      })
      .finally(() => {
        setTimeout(() => setRegisterStatus("idle"), 2500);
      });
  }

  return (
    <>
      <h1 className="text-center text-3xl sm:text-5xl font-bold text-brand-light py-8">
        Register Now
      </h1>

      {registerStatus == "success" && (
        <div className="bg-green-600 text-white text-center p-2 max-w-md mx-auto mb-10 rounded-[10px]">
          Account created successfully!
        </div>
      )}
      {registerStatus != "idle" &&
        registerStatus !== "loading" &&
        registerStatus !== "success" && (
          <div className="bg-red-600 text-white text-center p-2 max-w-md mx-auto mb-10 rounded-[10px]">
            {registerStatus}
          </div>
        )}

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="max-w-lg mx-auto"
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("name")}
            type="text"
            id="name"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="name"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Name
          </label>
          {formState.errors.name && formState.touchedFields.name && (
            <p className="text-red-600 text-sm">
              {formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("username")}
            type="text"
            id="username"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="username"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your username
          </label>
          {formState.errors.name && formState.touchedFields.name && (
            <p className="text-red-600 text-sm">
              {formState.errors.username.message}
            </p>
          )}
        </div>
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
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("rePassword")}
            type={isRePasswordInput ? "password" : "text"}
            id="rePassword"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="rePassword"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Confirm Your Password
          </label>
          <span className="absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer">
            {isRePasswordInput ? (
              <LuEye onClick={() => setIsRePasswordInput(false)} />
            ) : (
              <LuEyeOff onClick={() => setIsRePasswordInput(true)} />
            )}
          </span>
          {formState.errors.rePassword &&
            formState.touchedFields.rePassword && (
              <p className="text-red-600 text-sm">
                {formState.errors.rePassword.message}
              </p>
            )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("dateOfBirth")}
            type="date"
            id="dateOfBirth"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="dateOfBirth"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Date of Birth
          </label>
          {formState.errors.dateOfBirth &&
            formState.touchedFields.dateOfBirth && (
              <p className="text-red-600 text-sm">
                {formState.errors.dateOfBirth.message}
              </p>
            )}
        </div>
        <div className="flex gap-4 mb-5">
          <div className="flex items-center">
            <input
              {...register("gender")}
              id="male"
              type="radio"
              defaultValue="male"
              className="w-4 h-4 text-neutral-primary bg-neutral-secondary-medium rounded-full checked:border-blue-600 focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
            />
            <label
              htmlFor="male"
              className="select-none ms-2 text-sm font-medium text-heading"
            >
              Male
            </label>
          </div>
          <div className="flex items-center">
            <input
              {...register("gender")}
              id="female"
              type="radio"
              defaultValue="female"
              className="w-4 h-4 text-neutral-primary bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
            />
            <label
              htmlFor="female"
              className="select-none ms-2 text-sm font-medium text-heading"
            >
              Female
            </label>
          </div>
        </div>
        {formState.errors.gender && formState.touchedFields.gender && (
          <p className="text-red-600 text-sm">
            {formState.errors.gender.message}
          </p>
        )}
        {registerStatus === "loading" ? (
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
            Register
          </button>
        )}
        <p className="text-sm text-gray-600 font-medium mt-3">
          Already have an account?{" "}
          <Link to={"/login"} className="text-brand-light">
            Login
          </Link>
        </p>
      </form>
    </>
  );
}

// <LuEye />
// <LuEyeOff />
