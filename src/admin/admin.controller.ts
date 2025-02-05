import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../roles.decorator';
import { RolesGuard } from '../roles.guard';

@Controller('admin')
@UseGuards(RolesGuard)  // Використовуємо RolesGuard на рівні контролера або окремих маршрутів
export class AdminController {

  @Roles('admin')  // Цей маршрут доступний тільки для користувачів з роллю 'admin'
  @Get('dashboard')
  getAdminDashboard() {
    return { message: 'Welcome to the admin dashboard' };
  }
}
