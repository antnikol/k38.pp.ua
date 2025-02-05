import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get('status')
  getStatus(): string {
    return 'API is working';
  }
}
