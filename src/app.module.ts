import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiController } from './api/api.controller';
import { ApiService } from './api/api.service';
import { User } from './entities/user.entity'; 
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get('DB_PORT')) || 3306,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        autoLoadEntities: true, // Підключає всі сутності автоматично
        synchronize: true, // Для продакшн краще false
      }),
    }),
    UserModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class AppModule {}
