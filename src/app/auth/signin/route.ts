import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest){
    const body = await req.json();
    
    const email = body.email
    const password = body.password

    const userId = 1
    const token = jwt.sign({userId}, "SECRET")

    return NextResponse.json({token})
}