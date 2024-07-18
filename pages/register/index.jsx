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
import { useTheme } from "next-themes";

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  const { theme } = useTheme();

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
      <main className={`flex justify-center items-center h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className={`w-full max-w-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-lg shadow-md p-8`}>
        <h1 className="text-3xl font-bold mb-8 text-center">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <Label className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Nama</Label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: true })}
            />
          </div>
          <div className="mb-6">
            <Label  className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: true })}
            />
          </div>
          <div className="mb-6 relative">
            <Label  className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Password</Label>
            <Input
              ref={passwordRef}
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 top-7 right-0 px-3 py-2 flex items-center">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <div className="flex items-center justify-center">
            <Button
              type="submit"
              className={"bg-blue-500 hover:bg-blue-700 text-white w-full"}>
              Register
            </Button>
          </div>
        </form>
        <p className="text-center mt-4">
         Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </main>
    </>
  );
}
