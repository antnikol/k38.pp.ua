import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto'; // Імпортуємо LoginDto
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { ConflictException } from '@nestjs/common';

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
    const user = await this.userService.findByEmail(loginDto.email); // Знайти користувача за email
    if (user && await bcrypt.compare(loginDto.password, user.password)) { // Перевірити хеш пароля
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

    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }


  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const { email, password, name, roles } = registerDto;

    // Перевірка, чи вже існує користувач з таким email
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email вже зареєстрований');
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      roles: roles || ['user'], // Встановлюємо роль за замовчуванням
    });

    // Збереження користувача в базі даних
    await this.userRepository.save(newUser);

    // Створення JWT токена
    const payload = { sub: newUser.id, email: newUser.email, roles: newUser.roles };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    return { access_token: token };
  }

}
