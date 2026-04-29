import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt'
import { AuthUserInput } from './dto/auth-user.input';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { createWriteStream, existsSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor( 
    private prisma: PrismaService,
    private jwtService: JwtService
   ) {}

  private signToken(user: { id: number, isAdmin: boolean }) {
    return this.jwtService.signAsync({
      sub: user.id,
      isAdmin: user.isAdmin
    })
  }

  async create(createUserInput: CreateUserInput, ctx: any) {
    if (await this.prisma.user.findUnique({where: { email: createUserInput.email }})) {
      throw new BadRequestException('Пользователь с таким email уже существует')
    }

    const user = await this.prisma.user.create({
      data: {
        email: createUserInput.email,
        password: await bcrypt.hash(createUserInput.password, 10),
        firstname: createUserInput.firstname,
        lastname: createUserInput.lastname,
        profile_picture: 'default_avatar.jpg'
      },
    });

    const access_token = await this.signToken({ id: user.id, isAdmin: user.isAdmin })

    ctx.res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: Boolean(process.env.PORT),
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return user;
  }

  async entrance(authUserInput: AuthUserInput, ctx: any) {
    const user = await this.prisma.user.findUnique({ where: { email: authUserInput.email } })
    if (user) {
      const password = await bcrypt.compare(authUserInput.password, user.password)
      if (password) {
        const access_token = await this.signToken({ id: user.id, isAdmin: user.isAdmin })

        ctx.res.cookie('access_token', access_token, {
          httpOnly: true,
          secure: Boolean(process.env.PORT),
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return user;
      }
      throw new BadRequestException("Пароль неверный")
    }
    throw new BadRequestException("Данного пользователя не существует")
  }

  async findTop() {
    return `Return top 100 users`;
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({ where: { id: id } })
  }

  async update(updateUserInput: UpdateUserInput) {
    const { id, file } = updateUserInput;

    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      let newFilename = user.profile_picture;

      if (file) {
        const { createReadStream, filename } = await file;

        const uniqueName = `${uuidv4()}${filename.substring(filename.lastIndexOf('.'))}`;
        const uploadPath = join(process.cwd(), 'uploads', uniqueName);

        const stream = createReadStream();

        await new Promise((resolve, reject) => {
          stream
            .pipe(createWriteStream(uploadPath))
            .on('finish', resolve)
            .on('error', reject);
        });

        newFilename = uniqueName;

        if (user.profile_picture && user.profile_picture !== 'default_avatar.jpg') {
          const oldPath = join(process.cwd(), 'uploads', user.profile_picture);

          if (existsSync(oldPath)) {
            try {
              unlinkSync(oldPath);
            } catch (err) {
              console.error('Failed to delete old file:', err);
            }
          }
        }
      }

      await this.prisma.user.update({
        where: { id },
        data: {
          profile_picture: newFilename,
        },
      });

      return true;

    } catch (error) {
      console.error('Update user error:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async scoreMe(userId: number) {
    const result = await this.prisma.progress.aggregate({
      where: { user_id: userId },
      _sum: { value: true },
    });

    return result._sum.value ?? 0;
  }

  async scores() {
    const topProgress = await this.prisma.progress.groupBy({
      by: ['user_id'],
      _sum: {
        value: true,
      },
      orderBy: {
        _sum: {
          value: 'desc',
        },
      },
      take: 25,
    });

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: topProgress.map((item) => item.user_id),
        },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        profile_picture: true,
      },
    });

    const usersMap = new Map(users.map((u) => [u.id, u]));

    return topProgress
      .map((item) => {
        const user = usersMap.get(item.user_id);

        if (!user) return null;

        return {
          firstname: user.firstname,
          lastname: user.lastname,
          profile_picture: user.profile_picture,
          xp: item._sum.value ?? 0,
        };
      })
      .filter(Boolean);
  }
}