import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import { S3Service } from 'src/common/s3/s3.service';
import { USER_IMAGE_FILE_EXTENSION, USERS_BUCKET } from './constants';
import { UserDocument } from './entities/user.document';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) { }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  public async create(createUserInput: CreateUserInput) {
    try {
      const user = await this.usersRepository.create({
        ...createUserInput,
        password: await this.hashPassword(createUserInput.password),
      });

      return this.transformToUserEntity(user);
    } catch (error) {
      if (error.message.includes('E11000')) {
        throw new UnprocessableEntityException('Email already exists.');
      }

      throw error;
    }
  }

  public async findAll() {
    return (await this.usersRepository.find({})).map(
      this.transformToUserEntity,
    );
  }

  public async findOne(_id: string) {
    return this.transformToUserEntity(
      await this.usersRepository.findOne({ _id }),
    );
  }

  public async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput?.password) {
      updateUserInput.password = await this.hashPassword(
        updateUserInput.password,
      );
    }

    return this.transformToUserEntity(
      await this.usersRepository.findOneAndUpdate(
        { _id },
        { $set: updateUserInput },
      ),
    );
  }

  public async remove(_id: string) {
    return this.transformToUserEntity(
      await this.usersRepository.findOneAndDelete({ _id }),
    );
  }

  public async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.transformToUserEntity(user);
  }

  public async uploadImage(file: Buffer, userId: string) {
    await this.s3Service.upload({
      bucket: USERS_BUCKET,
      key: this.getUserImage(userId),
      file,
    });
  }

  public transformToUserEntity(userDocument: UserDocument): User {
    const temp = {
      ...userDocument,
      imageUrl: this.getUserImage(userDocument._id.toHexString()),
    };

    delete temp.password;

    return temp;
  }

  private getUserImage(userId: string) {
    return `${userId}.${USER_IMAGE_FILE_EXTENSION}`;
  }
}
