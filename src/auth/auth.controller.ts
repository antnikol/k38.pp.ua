import { Controller, Post, Body } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}

  @Post('login')
  login(@Body() loginDto: any) {
    // Ваш код для авторизації користувача (наприклад, перевірка користувача)
    
    const payload = { sub: 1, email: 'test@example.com' }; // Замість цього використовуйте дані користувача
    const secret = this.configService.get<string>('JWT_SECRET');
    
    if (!secret) {
      throw new Error('JWT_SECRET is not defined!');
    }

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    console.log('Generated Token:', token); // Лог для перевірки токена

    return { access_token: token };
  }
}