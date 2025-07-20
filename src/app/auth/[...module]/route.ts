import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest, { params }: { params: { module: string[] } }) {
    // Access the captured path segments
    const modulePaths = params.module;
    
    // Handle different module paths
    switch(modulePaths[0]) {
        case "login":
            return NextResponse.json({ message: "Login module" });
        case "register":
            return NextResponse.json({ message: "Register module" });
        case "reset-password":
            return NextResponse.json({ message: "Password reset module" });
        default:
            return NextResponse.json({ 
                message: "Auth module",
                path: modulePaths.join("/")
            });
    }
}