import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  createUser(@Body(ValidationPipe) ACDTO: AuthCredentialsDto): Promise<void> {
    return this.authService.createUser(ACDTO);
  }
}