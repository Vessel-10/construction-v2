import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { services: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to load categories." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { name, slug, description } = result.data;

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A category with this slug already exists." },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: { name, slug, description: description || null },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create category." },
      { status: 500 }
    );
  }
}