import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useSelector } from "react-redux";
import axios from "axios";

const Signup = () => {
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      // Set isAdmin based on the selected role
      const formattedData = {
        ...data,
        isAdmin: data.role === "admin", // True if role is admin, false otherwise
      };

      const response = await axios.post("http://localhost:8800/api/user/register", formattedData);

      if (response.status === 201) {
        alert("User registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };


  useEffect(() => {
    user && navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */ }
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600'>
              Join the ultimate task management solution!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>Get Started</span>
              <span>With Us Today</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* right side */ }
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={ handleSubmit(submitHandler) }
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div className=''>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Create Account
              </p>
              <p className='text-center text-base text-gray-700 '>
                Get started with your free account.
              </p>
            </div>

            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='John Doe'
                type='text'
                name='name'
                label='Full Name'
                className='w-full rounded-full'
                register={ register("name", {
                  required: "Full Name is required!",
                }) }
                error={ errors.name ? errors.name.message : "" }
              />
              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={ register("email", {
                  required: "Email Address is required!",
                }) }
                error={ errors.email ? errors.email.message : "" }
              />
              <Textbox
                placeholder='your password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={ register("password", {
                  required: "Password is required!",
                }) }
                error={ errors.password ? errors.password.message : "" }
              />
              <Textbox
                placeholder='confirm your password'
                type='password'
                name='confirmPassword'
                label='Confirm Password'
                className='w-full rounded-full'
                register={ register("confirmPassword", {
                  required: "Please confirm your password!",
                }) }
                error={ errors.confirmPassword ? errors.confirmPassword.message : "" }
              />

              {/* Role Dropdown */ }
              <div className='flex flex-col'>
                <label className='text-gray-700'>Role</label>
                <select
                  { ...register("role", { required: "Role is required!" }) }
                  className='w-full p-2 mt-1 border rounded-full text-gray-700'
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
                { errors.role && <p className='text-red-500 text-sm'>{ errors.role.message }</p> }
              </div>

              {/* Title Input */ }
              <Textbox
                placeholder='Job Title'
                type='text'
                name='title'
                label='Title'
                className='w-full rounded-full'
                register={ register("title", {
                  required: "Title is required!",
                }) }
                error={ errors.title ? errors.title.message : "" }
              />

              <Button
                type='submit'
                label='Sign Up'
                className='w-full h-10 bg-blue-700 text-white rounded-full'
              />

              <p className='text-center text-sm text-gray-500'>
                Already have an account?{ ' ' }
                <Link to="/login" className='text-blue-600 hover:underline cursor-pointer'>
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
