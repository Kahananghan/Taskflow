import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prismaClient = new PrismaClient()

// Zod schema for signup validation
const signupSchema = z.object({
    email: z.string().email("Invalid email format"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

// Type inference from Zod schema
type SignupData = z.infer<typeof signupSchema>;

// Validation middleware function using Zod
function validateSignupData(data: unknown): { valid: boolean; error?: string; data?: SignupData } {
    const result = signupSchema.safeParse(data);
    if (!result.success) {
        // Extract the first error message
        const errorMessage = result.error.format()._errors?.[0] || "Invalid input data";
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
        const validation = validateSignupData(rawData)
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 })
        }
        
        // Use the validated and typed data
        if (!validation.data) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
        }
        
        const { email, name, password } = validation.data

        const user = await prismaClient.user.create({
            data: {
                email,
                name,
                password // In production, hash this password!
            }
        })

        return NextResponse.json({ id: user.id, email: user.email })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }
}