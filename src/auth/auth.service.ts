import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto'; // Імпортуємо LoginDto
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, // Inject ConfigService here
    private readonly userService: UserService, // Inject UserService here
  ) {}

  // async validateUser(email: string, password: string): Promise<User | null> {
  //   const user = await this.userRepository.findOne({ where: { email } });
  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     return user;
  //   }
  //   return null;
  // }
  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);  // Знайти користувача за email
    if (user && user.password === loginDto.password) {  // Перевірити пароль
      return user;  // Повертаємо користувача, якщо все вірно
    }
    return null;  // Якщо не знайдено або пароль невірний
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    const user = await this.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Неправильний email або пароль');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      // додаткові параметри, наприклад, алгоритм, термін дії, якщо необхідно
    });
    console.log('Generated Token:', this.jwtService.sign(payload));
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
