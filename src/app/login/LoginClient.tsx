"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { login, register } from "../lib/api";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setIsRegister(mode === "register");
  }, [mode]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // 🔥 clear error chung
  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    if (isRegister && password !== confirmPassword) {
      setErrors({ confirmPassword: "Mật khẩu không khớp" });
      return;
    }

    try {
      if (isRegister) {
        await register({
          name,
          email,
          password,
          confirmPassword,
        });
        alert("Đăng ký thành công!");
        router.push("/login");
      } else {
        await login({ email, password });
        alert("Đăng nhập thành công!");
        router.push("/courses");
      }
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        alert(data?.error || "Đã có lỗi xảy ra");
      }
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="w-[1100px] bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-2">
        {/* LEFT */}
        <div className="bg-[#5c5f3a] text-white p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-white text-[#5c5f3a] flex items-center justify-center rounded">
                📘
              </div>
              <span className="font-semibold text-lg">EduStream</span>
            </div>

            <h1 className="text-3xl font-light leading-relaxed mb-8">
              Nâng tầm tri thức <br />
              <span className="italic">mỗi ngày cùng chúng tôi.</span>
            </h1>

            <ul className="space-y-4 text-sm">
              <li>✔ Hơn 500+ khóa học chuyên sâu</li>
              <li>✔ Giảng viên từ các tập đoàn lớn</li>
              <li>✔ Chứng chỉ có giá trị quốc tế</li>
              <li>✔ Cộng đồng học tập năng động</li>
            </ul>
          </div>

          <p className="text-sm italic opacity-80 mt-10">
            Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh
            phúc.
          </p>
        </div>

        {/* RIGHT */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-2">
            {isRegister ? "Tạo tài khoản" : "Chào mừng trở lại"}
          </h2>

          <p className="text-gray-500 mb-6">
            {isRegister
              ? "Đăng ký để bắt đầu học tập."
              : "Vui lòng đăng nhập để tiếp tục học tập."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            {isRegister && (
              <div>
                <label className="text-sm font-medium">HỌ VÀ TÊN</label>
                <input
                  type="text"
                  value={name}
                  onFocus={() => clearError("name")}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                  className={`w-full mt-1 px-4 py-3 border rounded-xl ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">EMAIL</label>
              <input
                type="email"
                value={email}
                onFocus={() => clearError("email")}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                className={`w-full mt-1 px-4 py-3 border rounded-xl ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">MẬT KHẨU</label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onFocus={() => {
                    clearError("password");
                    clearError("confirmPassword"); // 🔥 liên quan nhau
                  }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                    clearError("confirmPassword");
                  }}
                  className={`w-full px-4 py-3 border rounded-xl ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  👁
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            {isRegister && (
              <div>
                <label className="text-sm font-medium">
                  NHẬP LẠI MẬT KHẨU
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onFocus={() => clearError("confirmPassword")}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                  }}
                  className={`w-full mt-1 px-4 py-3 border rounded-xl ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#5c5f3a] text-white py-3 rounded-xl hover:opacity-90 transition"
            >
              {isRegister ? "Đăng ký →" : "Đăng nhập →"}
            </button>
          </form>

          {/* SWITCH */}
          <p className="text-center text-sm mt-6">
            {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
            <span
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#5c5f3a] font-medium ml-1 cursor-pointer"
            >
              {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}