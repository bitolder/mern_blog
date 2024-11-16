import { Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formdata, setFormeData] = useState([]);
  const handleSubmit = () => {};
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left*/}
        <div className="flex-1">
          <Link to="/" className=" font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Ysh
            </span>
            blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/* right*/}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your username" />
              <TextInput id="username" type="text" placeholder="Username" />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                id="email"
                type="text"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput id="password" type="password" />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            >
              Sign up
            </Button>
          </form>
          <div className="flex gap-3 items-center text-sm mt-5">
            <span>Have an account?</span>
            <Link className="text-blue-500" to="/sign-in">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
