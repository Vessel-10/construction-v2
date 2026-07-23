import bcrypt from "bcrypt";

export async function hashPassword(plainPassword: string) {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
}

export async function verifyPassword(
    plainPassword: string,
    hashedPassword: string
) {
    return bcrypt.compare(plainPassword, hashedPassword);
}