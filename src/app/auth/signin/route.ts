import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prismaClient = new PrismaClient()

// Zod schema for signin validation
const signinSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});

// Type inference from Zod schema
type SigninData = z.infer<typeof signinSchema>;

// Validation middleware function using Zod
function validateSigninData(data: unknown): { valid: boolean; error?: string; data?: SigninData } {
    const result = signinSchema.safeParse(data);
    if (!result.success) {
        // Extract the first error message
        const errorMessage = result.error.format()._errors?.[0] || "Invalid credentials";
        return { valid: false, error: errorMessage };
    }
    return { valid: true, data: result.data };
}

export async function GET() {
    try {
        const users = await prismaClient.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }
}

export async function POST(req: NextRequest){
    try {
        const rawData = await req.json()
        
        // Apply validation middleware with Zod
        const validation = validateSigninData(rawData)
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 })
        }
        
        // Use the validated and typed data
        if (!validation.data) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
        }
        
        const { email, password } = validation.data

        const user = await prismaClient.user.findUnique({
            where: { email }
        })

        if (!user || user.password !== password) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        return NextResponse.json({ id: user.id, email: user.email })
    } catch (error) {
        return NextResponse.json({ error: "Sign in failed" }, { status: 500 })
    }
}