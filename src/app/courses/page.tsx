"use client";
import { useState, useEffect } from "react"; //thêm useEffect
import { useRouter } from "next/navigation";

type Course = {
  _id: string;
  title: string;
  teacher: string;
  price: string;
  image?: string;
  purchased?: boolean;
};

type StatProps = {
  title: string;
  label: string;
};

type CategoryProps = {
  name: string;
};

export default function Home() {
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  //  LẤY USER TỪ TOKEN
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      });
  }, []);

  useEffect(() => {
    fetch("/api/course")
      .then((res) => res.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]));
  }, []);

  // LOGOUT
const handleLogout = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  setUser(null);
  router.push("/"); 
};

  return (
    <div className="bg-gray-100 text-[#1A1A1A]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-xl">E-Learning</h1>

          {user ? (
            <div className="flex items-center gap-4">
              {/*  HIỂN THỊ NAME */}
              <span className="font-semibold">👋 {user.name}</span>

              <img
                src="https://i.pravatar.cc/40"
                className="w-10 h-10 rounded-full"
              />

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-[#5A5A40] text-white rounded-lg"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      {/* HOME */}
      {!showAuth && (
        <div className="pt-32">
          {/* HERO */}
          <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl font-serif leading-tight mb-6">
                Khai phá <span className="italic">năng lực </span> của bạn
              </h1>
              <p className="text-gray-500 mb-8">
                Học từ chuyên gia hàng đầu với hàng trăm khóa học chất lượng
                cao.
              </p>
              <button
                onClick={() => setShowAuth(true)}
                className="px-8 py-4 bg-[#5A5A40] text-white rounded-xl"
              >
                Bắt đầu học ngay →
              </button>
            </div>

            <img
              src="https://picsum.photos/800/500"
              className="rounded-3xl shadow-xl"
              alt="hero"
            />
          </section>

          {/* COURSES */}
          <section className="py-20 max-w-7xl mx-auto px-6">
            <h2 className="text-4xl mb-10">Khóa học nổi bật</h2>

            <div className="flex gap-6 overflow-x-auto pb-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => router.push(`/courses/${course._id}`)}
                  className="min-w-[300px] bg-white rounded-3xl shadow hover:shadow-xl transition p-5"
                >
                  <img
                    src={course.image || "https://picsum.photos/401/250"}

                    className="rounded-xl mb-4"
                    alt={course.title}
                  />
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  {course.purchased && (
                    <p className="inline-block text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded mb-2">
                      Đã mua
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mb-2">
                    Giảng viên: {course.teacher}
                  </p>
                  <p className="text-[#5A5A40] font-bold">{course.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* STATS */}
          <section className="bg-[#F8F7F5] py-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <Stat title="500+" label="Khóa học" />
              <Stat title="10,000+" label="Học viên" />
              <Stat title="150+" label="Giảng viên" />
              <Stat title="20+" label="Quốc gia" />
            </div>
          </section>

          {/* CATEGORIES */}
          <section className="py-20 max-w-7xl mx-auto px-6">
            <h2 className="text-4xl mb-10">Danh mục phổ biến</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Category name="Lập trình (120)" />
              <Category name="Thiết kế (85)" />
              <Category name="Marketing (64)" />
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto bg-[#5A5A40] text-white rounded-3xl p-16 text-center">
              <h2 className="text-4xl mb-6">Sẵn sàng bắt đầu?</h2>
              <button
                onClick={() => router.push("/login?mode=register")}
                className="px-8 py-4 bg-white text-[#5A5A40] rounded-xl"
              >
                Đăng ký miễn phí
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Stat({ title, label }: StatProps) {
  return (
    <div>
      <h3 className="text-3xl font-bold">{title}</h3>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}

function Category({ name }: CategoryProps) {
  return <div className="bg-white p-6 rounded-3xl shadow">{name}</div>;
}