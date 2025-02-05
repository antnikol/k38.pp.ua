import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    console.log('JWT Auth Guard:', user, info); // Додати лог для перевірки користувача
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
