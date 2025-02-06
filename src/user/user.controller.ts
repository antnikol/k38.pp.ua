import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(
      createUserDto.name ?? '',
      createUserDto.email ?? '',
      createUserDto.password ?? ''
    );
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('email') email: string,
  ): Promise<User | null> {
    return this.userService.updateUser(id, name, email);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<boolean> {
    return this.userService.deleteUser(id);
  }
}
