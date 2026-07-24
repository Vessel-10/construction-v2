import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { success: false, message: "A category with this slug already exists." },
        { status: 409 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description: description || null },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { services: true },
    });

    if (category && category.services.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Can't delete — ${category.services.length} service(s) still use this category.`,
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Category deleted." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category." },
      { status: 500 }
    );
  }
}