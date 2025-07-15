import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient()

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