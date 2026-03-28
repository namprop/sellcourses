"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  setShowAuth: (value: boolean) => void;
};

// export default function Header({ setShowAuth }: Props) {
//   const [scrolled, setScrolled] = useState<boolean>(false);

export default function Header() {
  const [scrolled, setScrolled] = useState<boolean>(false);

  const Router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 w-full z-50 py-6 transition-all ${
        scrolled ? "bg-gray-100 shadow" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <div
          onClick={() => Router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white">
            📘
          </div>
          <span className="font-bold text-xl">EduStream</span>
        </div>

        {/* ACTION */}
        <div className="flex gap-4">
          <button
            onClick={() => Router.push("/login")}
            className="px-5 py-2 text-[#5A5A40]"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => (Router.push("/"))}
            className="px-5 py-2 bg-[#5A5A40] text-white rounded-full"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}
