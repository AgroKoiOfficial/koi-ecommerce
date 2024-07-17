import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      toast.success("Email lupa kata sandi dikirim");
      setMessage(data.message);
    } catch (error) {
      toast.error("Gagal mengirim email lupa kata sandi");
      setMessage("Gagal mengirim email lupa kata sandi");
    }
  };

  return (
    <>
      <Head>
        <title>Lupa Kata Sandi</title>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Forgot Password" />
      </Head>

      <main className={`flex justify-center items-center h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`w-full max-w-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-lg shadow-md p-8`}>
          <h1 className=" text-2xl lg:text-4xl font-bold mb-6 text-center">
            Lupa Kata Sandi
          </h1>
          <p className=" text-md text-center lg:text-lg mb-8">
            Masukan email anda dan kami akan mengirimkan token lupa kata sandi
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="mb-4">
              <Input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className=" bg-blue-500 text-white hover:bg-blue-600 w-full">
              Reset Password
            </Button>
          </form>

          {message && <p className="text-green-500 mt-4">{message}</p>}

          <p className="mt-8 mb-8 text-center">
            Ingat kata sandi?{" "}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
