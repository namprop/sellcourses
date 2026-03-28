"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Course = {
  _id: string;
  title: string;
  teacher: string;
  price: string;
  image?: string;
  description?: string;
  purchased?: boolean;
};

export default function CourseDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/course/${id}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) {
          throw new Error("Fetch failed");
        }
        const data = (await res.json()) as Course;
        setCourse(data);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (!notFound && !course) {
    return <div className="p-10 text-center">Đang tải...</div>;
  }

  if (notFound || !course) {
    return <div className="p-10 text-center">Không tìm thấy khóa học</div>;
  }

  const handleBuyCourse = async () => {
    if (course.purchased) return;

    setBuying(true);
    const res = await fetch(`/api/course/${course._id}/purchase`, { method: "POST" });
    const data = await res.json();
    setBuying(false);

    if (!res.ok) {
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      alert(data.error || "Mua khóa học thất bại");
      return;
    }

    setCourse((prev) => (prev ? { ...prev, purchased: true } : prev));
    alert(data.message || "Mua khóa học thành công");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-[#5A5A40] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 underline"
          >
            ← Quay lại
          </button>

          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg opacity-80">
            Giảng viên: {course.teacher}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6 py-10">
        {/* LEFT */}
        <div className="md:col-span-2">
          <img
            src={course.image || "https://picsum.photos/800/400"}
            className="rounded-2xl mb-6"
            alt={course.title}
          />

          <h2 className="text-2xl font-bold mb-4">
            Mô tả khóa học
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {course.description || "Chưa có mô tả."}
          </p>

          {/* FAKE LESSON LIST */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
              Nội dung khóa học
            </h2>

            <ul className="space-y-3">
              <li className="bg-white p-4 rounded-lg shadow">
                Bài 1: Giới thiệu
              </li>
              <li className="bg-white p-4 rounded-lg shadow">
                Bài 2: Cài đặt môi trường
              </li>
              <li className="bg-white p-4 rounded-lg shadow">
                Bài 3: Thực hành dự án
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT - BUY CARD */}
        <div>
          <div className="bg-white p-6 rounded-2xl shadow sticky top-24">
            <img
              src={course.image || "https://picsum.photos/800/400"}
              className="rounded-xl mb-4"
              alt={course.title}
            />

            <h3 className="text-xl font-bold mb-2">
              {course.price}
            </h3>

            <button
              onClick={handleBuyCourse}
              disabled={buying || course.purchased}
              className={`w-full py-3 text-white rounded-xl mb-3 ${
                course.purchased ? "bg-green-600" : "bg-[#5A5A40]"
              } ${buying ? "opacity-80" : ""}`}
            >
              {course.purchased ? "Đã mua" : buying ? "Đang xử lý..." : "Mua khóa học"}
            </button>

            <button
              onClick={() => router.push(`/courses/${course._id}/lessons`)}
              className={`w-full py-3 rounded-xl mb-3 border ${
                course.purchased
                  ? "bg-[#1f2937] text-white border-[#1f2937]"
                  : "bg-white text-gray-500 border-gray-300"
              }`}
            >
              {course.purchased ? "Vào học ngay" : "Mua khóa học để xem bài học"}
            </button>

            <button className="w-full py-3 border rounded-xl">
              Thêm vào giỏ
            </button>

            <ul className="text-sm text-gray-500 mt-4 space-y-2">
              <li>✔ Học trọn đời</li>
              <li>✔ Hơn 20 bài học</li>
              <li>✔ Có chứng chỉ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}