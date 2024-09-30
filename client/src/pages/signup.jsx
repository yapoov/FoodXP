import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import InputField from "../components/inputField";
import { useAuth } from "../hooks/useAuth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setFirstnameError("");
    setLastnameError("");

    let valid = true;

    if (!email || !password || !confirmPassword || !firstname || !lastname) {
      setServerError("Please fill all fields.");
      valid = false;
    }
    if (!validateEmail(email)) {
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      valid = false;
    }

    if (!/^[A-Za-z]+$/.test(firstname)) {
      setFirstnameError("First name must only contain letters");
      valid = false;
    }

    if (!/^[A-Za-z]+$/.test(lastname)) {
      setLastnameError("Last name must only contain letters");
      valid = false;
    }

    if (!valid) return;
    try {
      const res = await fetch("/auth/register", {
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
        setServerError(data.message || "Register failed. Please try again.");
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
        <span className=" text-teal-500 text-center font-bold uppercase text-5xl ">
          Foodxp
        </span>
      </div>
      {serverError && <p className="text-red-500 py-2">{serverError}</p>}
      <form className="md:w-1/3 max-w-sm" onSubmit={handleSubmit}>
        <InputField
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          error={emailError}
        />
        <InputField
          type="text"
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="First Name"
          error={firstnameError}
        />
        <InputField
          type="text"
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Last Name"
          error={lastnameError}
        />
        <InputField
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          error={passwordError}
        />
        <InputField
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          error={confirmPasswordError}
        />

        <div className="flex justify-between  text-center md:text-left">
          <button
            className=" flex-grow rounded-full mt-4 p-4  bg-teal-500 hover:bg-teal-400 p-3 text-white uppercase  text-sm
           tracking-wider"
            type="submit"
          >
            Register
          </button>
        </div>
        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Already have an account?{" "}
          <Link
            className="text-yellow-600 hover:underline hover:underline-offset-4"
            to="/login"
          >
            Login
          </Link>
        </div>
      </form>
    </section>
  );
};

export default Signup;
