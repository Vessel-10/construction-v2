import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validations/service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to load service." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { success: false, message: "A service with this slug already exists." },
        { status: 409 }
      );
    }

    const service = await prisma.service.update({
      where: { id },
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
      { success: false, message: "Failed to update service." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Service deleted." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete service." },
      { status: 500 }
    );
  }
}