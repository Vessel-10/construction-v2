import { SignJWT, jwtVerify } from "jose";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in .env");
}
const secretKey = new TextEncoder().encode(JWT_SECRET);

export type AuthPayload = {
    userId: string;
    email: string;
    role: string;
};

export async function signToken(payload: AuthPayload) {
    return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as AuthPayload & { iat: number; exp: number };
    } catch {
        return null;
    }
}