import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Імпортуємо наш AuthGuard

@Controller('api')
export class ApiController {
  // Цей маршрут буде доступний лише після перевірки JWT
  @Get('protected')
  @UseGuards(JwtAuthGuard)  // Додаємо захист
  getProtectedData() {
    return { message: 'Цей ресурс захищений' };
  }

  // Це відкритий маршрут, доступний без авторизації
  @Get('status')
  getStatus() {
    return { message: 'API is working' };
  }
}
