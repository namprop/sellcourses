"use client";

type FooterColProps = {
  title: string;
  items: string[];
};

function FooterCol({ title, items }: FooterColProps) {
  return (
    <div>
      <h4 className="mb-4">{title}</h4>
      <ul className="text-sm text-gray-400 space-y-2">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
export default function Foot() {
  return (
    <>
      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl mb-4">EduStream</h3>
            <p className="text-gray-400 text-sm">
              Nền tảng học online hàng đầu Việt Nam.
            </p>
          </div>

          <FooterCol
            title="Khám phá"
            items={["Khóa học", "Giảng viên", "Blog"]}
          />

          <FooterCol title="Hỗ trợ" items={["Liên hệ", "Chính sách"]} />

          <div>
            <h4 className="mb-4">Đăng ký</h4>
            <input
              className="w-full p-2 rounded bg-gray-800 mb-2"
              placeholder="Email"
            />
            <button className="bg-white text-black px-4 py-2 rounded">
              Gửi
            </button>
          </div>
        </div>

        <div className="text-center text-gray-500 mt-10 text-sm">
          © 2026 EduStream
        </div>
      </footer>
    </>
  );
}

