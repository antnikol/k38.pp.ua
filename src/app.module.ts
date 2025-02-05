import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api/api.controller';
import { ApiService } from './api/api.service';
import { User } from './entities/user.entity'; 

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,  // Ваш IP адреса або домен
      port: 3306,
      username: process.env.DB_USER,  // Користувач
      password: process.env.DB_PASSWORD,  // Пароль
      database: process.env.DB_NAME,  // Назва бази даних
      entities: [User],
      synchronize: true,  // Встановити на false для продакшн
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class AppModule {}
