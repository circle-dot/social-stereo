import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        // Get the authorization header from the incoming request
        const authHeader = request.headers.get('Authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
        }

        // Get the request body
        const body = await request.json()

        // Forward the request to the STAMP API
        const response = await fetch(`${process.env.NEXT_PUBLIC_STAMP_API_URL}/pod/verify-proof`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(body)
        })

        // Forward the response from the STAMP API
        const data = await response.json()
        return NextResponse.json(data, { status: response.status })

    } catch (error) {
        console.error('Error verifying POD:', error)
        return NextResponse.json({ error: 'Failed to verify POD' }, { status: 500 })
    }
}