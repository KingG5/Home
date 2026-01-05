import bcrypt from 'bcryptjs';
import { User } from '../models';
import { LoginRequest, SignupRequest, JWTPayload } from '../types';
import { generateToken } from '../middleware/auth';

export class AuthService {
  async signup(data: SignupRequest): Promise<{ user: User; token: string }> {
    const { username, email, password } = data;

    // Check if user exists
    const existingUser = await User.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    if (email) {
      const existingEmail = await User.findOne({
        where: { email },
      });

      if (existingEmail) {
        throw new Error('Email already exists');
      }
    }

    // Hash password if provided (allow guest accounts without password)
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
    });

    // Generate token
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
    };
    const token = generateToken(payload);

    return { user, token };
  }

  async login(data: LoginRequest): Promise<{ user: User; token: string }> {
    const { username, password } = data;

    // Find user
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password if user has one
    if (user.passwordHash) {
      if (!password) {
        throw new Error('Password required');
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }
    }

    // Generate token
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
    };
    const token = generateToken(payload);

    return { user, token };
  }

  async quickJoin(username: string): Promise<{ user: User; token: string }> {
    // Create temporary guest account
    const guestUsername = `${username}_${Date.now()}`;

    const user = await User.create({
      username: guestUsername,
    });

    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
    };
    const token = generateToken(payload);

    return { user, token };
  }
}

export default new AuthService();
