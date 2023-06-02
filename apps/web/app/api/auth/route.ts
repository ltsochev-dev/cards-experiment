import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@cards/jwt'

export async function POST(request: NextRequest) {
    const { avatar, username, locale = 'en' } = await request.json()

    const token = generateToken({ avatar, username, locale })

    return NextResponse.json({ token })
}