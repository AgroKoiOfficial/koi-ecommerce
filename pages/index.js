import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const GoogleAnalytics = dynamic(() => import('@next/third-parties/google').then(mod => mod.GoogleAnalytics), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
   <main className="flex pt-16 mb-20">
    hello
   </main>
   <GoogleAnalytics gaId="G-BKXLWYCWM3" />
    </>
  );
}
