import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: UserRepository) {}

  async signUpUser(authCredentialsDto: AuthCredentialDto): Promise<void> {
    return this.userRepository.signUpUser(authCredentialsDto);
  }

  async signInUser(authCredentialsDto: AuthCredentialDto) {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
