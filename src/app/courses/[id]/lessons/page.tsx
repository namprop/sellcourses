"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Course = {
  _id: string;
  title: string;
  teacher: string;
  image?: string;
  description?: string;
  purchased?: boolean;
};

export default function LessonsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/course/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return (await res.json()) as Course;
      })
      .then((data) => setCourse(data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [id]);

  const lessons = useMemo(() => {
    const base = [
      "Giới thiệu khóa học và lộ trình học",
      "Cài đặt môi trường và công cụ cần thiết",
      "Xây dựng project thực tế từng bước",
      "Tối ưu hiệu năng và clean code",
      "Tổng kết, bài tập thực hành và định hướng tiếp theo",
    ];

    if (!course?.description) return base;
    return [...base.slice(0, 2), `Phân tích chuyên sâu: ${course.description}`, ...base.slice(2)];
  }, [course?.description]);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-10 text-center">Đang tải...</div>;
  }

  if (!course) {
    return <div className="min-h-screen bg-gray-100 p-10 text-center">Không tìm thấy khóa học.</div>;
  }

  if (!course.purchased) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Bạn chưa mua khóa học này
          </h1>
          <p className="text-gray-600 mb-8">
            Vui lòng mua khóa học để mở toàn bộ nội dung bài học và theo dõi tiến độ học tập.
          </p>
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push(`/courses/${course._id}`)}
              className="px-6 py-3 rounded-xl bg-[#5A5A40] text-white font-semibold"
            >
              Quay lại trang khóa học
            </button>
            <button
              onClick={() => router.push("/courses")}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold"
            >
              Xem khóa học khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9fafb] to-[#eef2f7]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <button
            onClick={() => router.push(`/courses/${course._id}`)}
            className="text-sm mb-4 text-[#5A5A40] font-semibold"
          >
            ← Quay lại khóa học
          </button>

          <div className="grid md:grid-cols-[180px_1fr] gap-6 items-center">
            <img
              src={course.image || "https://picsum.photos/seed/course-banner/400/220"}
              alt={course.title}
              className="w-full h-40 object-cover rounded-2xl"
            />
            <div>
              <p className="inline-flex px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold mb-3">
                Đã mở khóa
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
              <p className="text-gray-500">Giảng viên: {course.teacher}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách bài học</h2>
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div
                key={`${lesson}-${index}`}
                className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#5A5A40] text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Bài {index + 1}</h3>
                  <p className="text-gray-600 text-sm">{lesson}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

