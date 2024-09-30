import React, { useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/inputField";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setServerError("");
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        await login(data.token);
      } else {
        setServerError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setServerError("An error occurred. Please try again later.");
    }
  };

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm flex justify-center items-center">
        <img
          className="object-scale-down h-28"
          src="/foodxp_logo.png"
          alt="foodxp logo"
        />
        <span className=" text-teal-500 text-center font-bold uppercase text-5xl">
          Foodxp
        </span>
      </div>

      <form onSubmit={handleSubmit} className="md:w-1/3 max-w-sm">
        {serverError && <p className="text-red-500 py-2">{serverError}</p>}

        <InputField
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          placeholder="Email"
        />
        <InputField
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
        />
        <div className="mt-4 flex justify-between font-semibold text-sm">
          <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
            <input className="mr-1" type="checkbox" />
            <span>Remember Me</span>
          </label>
          <a
            className="text-yellow-600 hover:text-yellow-700 hover:underline hover:underline-offset-4"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
        <div className="flex justify-between  text-center md:text-left">
          <button
            className=" flex-grow rounded-full mt-4 p-4 bg-teal-500 hover:bg-teal-600  text-white uppercase  text-xs tracking-wider"
            type="submit"
          >
            Login
          </button>
        </div>
        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don&apos;t have an account?{" "}
          <Link
            className=" text-yellow-600 hover:text-yellow-700 hover:underline hover:underline-offset-4"
            to={"/register"}
          >
            Register
          </Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
