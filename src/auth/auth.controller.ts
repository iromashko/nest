import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private AS: AuthService) {}

  @Post('signup')
  signUp(@Body() ACDTO: AuthCredentialsDto): Promise<void> {
    return this.AS.signUp(ACDTO);
  }
}
