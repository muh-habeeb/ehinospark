import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { Admin } from '@/lib/models';
import { comparePassword, signToken, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if admin exists
    let admin = await Admin.findOne({ username });

    // If no admin exists, create default admin
    if (!admin) {
      const defaultUsername = process.env.ADMIN_USERNAME!;
      const defaultPassword = process.env.ADMIN_PASSWORD!;
      if (!defaultUsername || !defaultPassword) {
        return NextResponse.json(
          { error: 'credential are not set' },
          { status: 401 }
        );
      }
      if (username === defaultUsername) {
        const hashedPassword = await hashPassword(defaultPassword);
        admin = await Admin.create({
          username: defaultUsername,
          password: hashedPassword,
          isActive: true
        });
      } else {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Account is disabled' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = signToken({
      adminId: admin._id,
      username: admin.username,
    });

    // Create response with token in httpOnly cookie
    const response = NextResponse.json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        lastLogin: admin.lastLogin,
      },
    });

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}