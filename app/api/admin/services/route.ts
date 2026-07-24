import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validations/service";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to load services." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = serviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { title, slug, description, image, price, categoryId } = result.data;

    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A service with this slug already exists." },
        { status: 409 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        image: image || null,
        price: price || null,
        categoryId,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create service." },
      { status: 500 }
    );
  }
}