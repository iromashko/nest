import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUpUser(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('user already exists');
      } else {
        throw new InternalServerErrorException('Server Error');
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
