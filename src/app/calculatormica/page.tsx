"use client";

import { useState, useEffect } from "react";

type Result = {
  orientation: string;
  perRow: number;
  rows: number;
  lengthCm: number;
  lengthM: number;
};

type ConfigParams = {
  defaultPrice60: number;
  defaultPrice80: number;
  defaultWaste: number;
};

export default function MicaCalculator() {
  const [dbConfig, setDbConfig] = useState<ConfigParams>({
    defaultPrice60: 150000,
    defaultPrice80: 200000,
    defaultWaste: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Main Form States
  const [rollWidth, setRollWidth] = useState(60);
  const [pieceWidth, setPieceWidth] = useState("");
  const [pieceHeight, setPieceHeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerMeter, setPricePerMeter] = useState("");
  const [wasteMeters, setWasteMeters] = useState("");

  const [best, setBest] = useState<Result | null>(null);
  const [finalMeters, setFinalMeters] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Settings Modal States
  const [showSettings, setShowSettings] = useState(false);
  const [setting60, setSetting60] = useState("");
  const [setting80, setSetting80] = useState("");
  const [settingWaste, setSettingWaste] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/micaconfig")
      .then((res) => res.json())
      .then((data) => {
        setDbConfig(data);
        setWasteMeters(String(data.defaultWaste));
        setPricePerMeter(String(data.defaultPrice60));

        setSetting60(String(data.defaultPrice60));
        setSetting80(String(data.defaultPrice80));
        setSettingWaste(String(data.defaultWaste));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load backend config", err);
        setIsLoading(false);
      });
  }, []);

  const handleNumberInput = (value: string) => value.replace(/[^0-9.]/g, "");

  const handleRollWidthChange = (val: number) => {
    setRollWidth(val);
    setPricePerMeter(val === 60 ? String(dbConfig.defaultPrice60) : String(dbConfig.defaultPrice80));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const payload = {
        defaultPrice60: Number(setting60) || 0,
        defaultPrice80: Number(setting80) || 0,
        defaultWaste: Number(settingWaste) || 0,
      };

      const res = await fetch("/api/micaconfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setDbConfig(data);

        setWasteMeters(String(data.defaultWaste));
        setPricePerMeter(rollWidth === 60 ? String(data.defaultPrice60) : String(data.defaultPrice80));
        setShowSettings(false);
      }
    } catch (err) {
      alert("Lỗi khi kết nối với backend!");
    } finally {
      setIsSaving(false);
    }
  };

  const calculate = () => {
    const width = Number(pieceWidth);
    const height = Number(pieceHeight);
    const qty = Number(quantity);
    const price = Number(pricePerMeter);
    const waste = Number(wasteMeters);

    if (!width || !height || !qty) return;

    const perRow1 = Math.floor(rollWidth / width);
    const rows1 = Math.ceil(qty / perRow1);
    const length1 = rows1 * height;
    const result1: Result = {
      orientation: `${width} ngang - ${height} dọc`,
      perRow: perRow1,
      rows: rows1,
      lengthCm: length1,
      lengthM: length1 / 100,
    };

    const perRow2 = Math.floor(rollWidth / height);
    const rows2 = Math.ceil(qty / perRow2);
    const length2 = rows2 * width;
    const result2: Result = {
      orientation: `${height} ngang - ${width} dọc`,
      perRow: perRow2,
      rows: rows2,
      lengthCm: length2,
      lengthM: length2 / 100,
    };

    const bestResult = length1 <= length2 ? result1 : result2;
    const final = Math.ceil(bestResult.lengthM + waste);
    const cost = final * price;

    setBest(bestResult);
    setFinalMeters(final);
    setTotalCost(cost);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-500 font-medium tracking-wide">
        Đang khởi tạo backend hệ thống...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-stretch justify-center bg-white relative">
      <div className="w-full max-w-[1200px] flex">

        {/* LEFT: INPUTS */}
        <div className="w-64 flex-shrink-0 flex flex-col p-5 border-r border-gray-100">
          <div className="mb-4 text-center border-b border-gray-200 pb-3 flex justify-between items-center">
            <h1 className="text-base font-semibold text-gray-800">
              Tính giá cuộn mica
            </h1>
            <button
              onClick={() => setShowSettings(true)}
              title="Cài đặt giá Database"
              className="p-1.5 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-3 overflow-auto">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Khổ cuộn</label>
              <select
                value={rollWidth}
                onChange={(e) => handleRollWidthChange(Number(e.target.value))}
                className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm outline-none focus:border-gray-500 bg-white"
              >
                <option value={60}>60 cm</option>
                <option value={80}>80 cm</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Số lượng tấm</label>
              <input
                type="text"
                placeholder="Nhập số lượng..."
                value={quantity}
                onChange={(e) => setQuantity(handleNumberInput(e.target.value))}
                className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm text-gray-600 block mb-1">Rộng (cm)</label>
                <input
                  type="text"
                  placeholder="VD: 20"
                  value={pieceWidth}
                  onChange={(e) => setPieceWidth(handleNumberInput(e.target.value))}
                  className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm outline-none focus:border-gray-500"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600 block mb-1">Dài (cm)</label>
                <input
                  type="text"
                  placeholder="VD: 30"
                  value={pieceHeight}
                  onChange={(e) => setPieceHeight(handleNumberInput(e.target.value))}
                  className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm outline-none focus:border-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Giá / mét (VNĐ) <span className="text-[10px] text-gray-400 font-light ml-1">(Từ db)</span></label>
              <input
                type="text"
                value={pricePerMeter}
                onChange={(e) => setPricePerMeter(handleNumberInput(e.target.value))}
                className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Bù hao (mét)</label>
              <input
                type="text"
                value={wasteMeters}
                onChange={(e) => setWasteMeters(handleNumberInput(e.target.value))}
                className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm outline-none focus:border-gray-500"
              />
            </div>
          </div>

          <button
            onClick={calculate}
            className="mt-4 w-full bg-gray-800 hover:bg-black text-white py-2 rounded text-sm font-medium transition-colors"
          >
            Tính toán
          </button>
        </div>

        {/* RIGHT: RESULT */}
        <div className="flex-1 flex flex-col p-8 justify-start pt-12 items-end">
          {best ? (
            <div className="w-80">
              <h2 className="text-base font-semibold mb-4 pb-3 border-b border-gray-200">
                Kết quả tính toán
              </h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 text-gray-500 w-1/2">Cách đặt tấm</td>
                    <td className="py-2.5 font-medium">{best.orientation}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 text-gray-500">Số tấm / hàng</td>
                    <td className="py-2.5 font-medium">{best.perRow} tấm</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 text-gray-500">Số hàng cắt</td>
                    <td className="py-2.5 font-medium">{best.rows} hàng</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 text-gray-500">Độ dài gốc</td>
                    <td className="py-2.5 font-medium">{best.lengthM.toFixed(2)} mét</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 text-gray-500">Bù hao</td>
                    <td className="py-2.5 font-medium">{Number(wasteMeters || 0)} mét</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2.5 text-gray-500">Tổng mét xuất</td>
                    <td className="py-2.5 font-semibold">{finalMeters.toFixed(2)} mét</td>
                  </tr>
                  <tr>
                    <td className="pt-4 font-semibold">Tổng tiền</td>
                    <td className="pt-4 font-bold text-lg">{totalCost.toLocaleString()} đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg w-full max-w-sm mt-5 border border-dashed border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-sm text-center">
                Nhập thông số bên trái và nhấn <strong className="text-gray-500 block mt-1 font-medium">Tính toán</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 border-b pb-3 border-gray-100">
              Cài đặt giá theo Database
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Giá mặc định: Cuộn 60cm</label>
                <input
                  type="text"
                  value={setting60}
                  onChange={(e) => setSetting60(handleNumberInput(e.target.value))}
                  className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-gray-800 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Giá mặc định: Cuộn 80cm</label>
                <input
                  type="text"
                  value={setting80}
                  onChange={(e) => setSetting80(handleNumberInput(e.target.value))}
                  className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:border-gray-800 outline-none"
                />
              </div>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                disabled={isSaving}
                onClick={() => setShowSettings(false)}
                className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 rounded text-sm font-medium"
              >
                Hủy bỏ
              </button>
              <button
                disabled={isSaving}
                onClick={saveSettings}
                className="flex-1 bg-gray-800 hover:bg-black text-white py-2 rounded text-sm font-medium disabled:bg-gray-400"
              >
                {isSaving ? "Đang lưu..." : "Lưu vào Database"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}