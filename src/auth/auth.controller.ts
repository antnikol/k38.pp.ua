import { Controller, Post, Body } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {   
    const user = await this.authService.validateUser(loginDto); 
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const payload = { sub: user.id, email: user.email, roles: user.roles };

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined!');
    }
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return { access_token: token };
  }
}