import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
export default function SignIn() {
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // submit the form here
    if (
      !formData.email ||
      !formData.password ||
      formData.email === "" ||
      formData.password === ""
    )
      return dispatch(signInFailure("Please enter all required fields"));
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        return dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex flex-col max-w-3xl md:flex-row gap-5 mx-auto  p-3 md:items-center">
        {/*left*/}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-semibold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Ysh
            </span>
            blog
          </Link>
          <p className="text-sm  mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/*right*/}
        <div className="flex-1 ">
          <form className="flex flex-col gap-4" onSubmit={onSubmitHandler}>
            <div>
              <Label value="Your email" />
              <TextInput
                placeholder="name@company.com"
                type="text"
                id="email"
                onChange={onChangeHandler}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                id="password"
                placeholder="****************"
                onChange={onChangeHandler}
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>{" "}
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="flex gap-3 items-center text-sm mt-5">
            <span>don't h ave an account?</span>
            <Link className="text-blue-500" to="/sign-up">
              Sign up
            </Link>
          </div>
          {error && <Alert color="failure">{error}</Alert>}
        </div>
      </div>
    </div>
  );
}
