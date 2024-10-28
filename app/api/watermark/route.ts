import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Generate a numeric watermark (timestamp only)
    const watermark = Date.now().toString();
    
    cookies().set('zuauth-watermark', watermark, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour expiry
    });

    return NextResponse.json({ watermark });
  } catch (error) {
    console.error('Watermark generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate watermark' },
      { status: 500 }
    );
  }
}
