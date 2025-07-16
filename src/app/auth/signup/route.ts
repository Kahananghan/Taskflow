import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient()

// Validation middleware function
function validateSignupData(data: any) {
    if (!data.email || !data.name || !data.password) {
        return { valid: false, error: "Missing required fields" }
    }
    if (data.password.length < 6) {
        return { valid: false, error: "Password must be at least 6 characters" }
    }
    return { valid: true }
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
        const data = await req.json()
        
        // Apply validation middleware
        const validation = validateSignupData(data)
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 })
        }

        const user = await prismaClient.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password
            }
        })

        return NextResponse.json({ id: user.id, email: user.email })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }
}