import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  const onSubmit = async (data) => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success("Registration successful");
      router.push("/login");
    } else {
      const { message } = await response.json();
      setError(message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <main className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <Label>Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: true })}
            />
          </div>
          <div className="mb-6">
            <Label>Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: true })}
            />
          </div>
          <div className="mb-6 relative">
            <Label>Password</Label>
            <Input
              ref={passwordRef}
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 top-7 right-0 px-3 py-2 flex items-center text-gray-600">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className={"bg-blue-500 hover:bg-blue-700 text-white"}>
              Register
            </Button>
          </div>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </main>
    </>
  );
}
