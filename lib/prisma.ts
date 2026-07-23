import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 2,
    delayMs = 1000
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        const isConnectionError =
        error instanceof Error &&
        (error.message.includes("Can't reach database server") ||
        error.message.includes("P1001"));

        if (isConnectionError && retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            return withRetry(fn, retries - 1, delayMs);
        }

        throw error;
    }
}