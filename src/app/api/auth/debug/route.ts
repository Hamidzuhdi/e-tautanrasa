// Debug endpoint to check authentication status
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    
    console.log('Debug - Cookie header:', cookieHeader);
    
    if (!cookieHeader) {
      return NextResponse.json({ 
        authenticated: false, 
        error: 'No cookie header found' 
      });
    }
    
    // Parse cookies
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    console.log('Debug - Parsed cookies:', cookies);
    
    const token = cookies['token'];
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false, 
        error: 'No token found in cookies',
        availableCookies: Object.keys(cookies) 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      console.log('Debug - Token decoded successfully:', decoded);
      
      return NextResponse.json({
        authenticated: true,
        user: decoded,
        tokenValid: true
      });
    } catch (jwtError) {
      console.log('Debug - JWT verification failed:', jwtError);
      return NextResponse.json({
        authenticated: false,
        error: 'Invalid token',
        jwtError: jwtError instanceof Error ? jwtError.message : 'Unknown JWT error'
      });
    }
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      authenticated: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}