import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useTheme } from "next-themes";
import { createCsrfToken } from "@edge-csrf/nextjs";

export const getServerSideProps = async ({ req, res }) => {
  const csrfToken = await createCsrfToken(req, res);
  return {
    props: {
      csrfToken,
    },
  };
};


const Login = ({ csrfToken }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        csrfToken, // Tambahkan CSRF token di sini
      });

      if (response.error) {
        setError(response.error);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Terjadi kesalahan tak terduga. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/logo.png" />
        <meta name="description" content="Login" />
      </Head>
      <main className={`flex justify-center items-center h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className={`w-full max-w-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-lg shadow-md p-8`}>
          <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <div className="mb-6">
              <Label className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
              />
            </div>
            <div className="mb-6 relative">
              <Label className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 top-7 right-0 px-3 py-2 flex items-center"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white w-full"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </div>
          </form>
          <p className="text-center mt-4">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-500">
              Daftar
            </Link>
          </p>
          <p className="text-center mt-4">
            Lupa kata sandi?{" "}
            <Link href="/forgot-password" className="text-blue-500">
              Lupa kata sandi
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default Login;
