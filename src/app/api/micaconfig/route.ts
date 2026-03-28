import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongoose";
import MicaConfig from "@/app/models/MicaConfig";

export async function GET() {
  try {
    await connect();
    let config = await MicaConfig.findOne({});
    if (!config) {
      config = await MicaConfig.create({
        defaultPrice60: 150000,
        defaultPrice80: 200000,
        defaultWaste: 0,
      });
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi kết nối cơ sở dữ liệu" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { defaultPrice60, defaultPrice80, defaultWaste } = body;

    await connect();
    let config = await MicaConfig.findOne({});

    if (!config) {
      config = await MicaConfig.create({
        defaultPrice60,
        defaultPrice80,
      });
    } else {
      config.defaultPrice60 = defaultPrice60 ?? config.defaultPrice60;
      config.defaultPrice80 = defaultPrice80 ?? config.defaultPrice80;
      await config.save();
    }

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi cập nhật cấu hình" },
      { status: 500 }
    );
  }
}
