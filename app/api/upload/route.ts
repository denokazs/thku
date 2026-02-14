import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({ error: 'Endpoint removed. Use /api/upload/sign' }, { status: 410 });
}

export async function GET() {
    return NextResponse.json({ error: 'Endpoint removed. Use /api/upload/sign' }, { status: 410 });
}
