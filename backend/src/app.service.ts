import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const email = process.env.EMAIL
    const password = process.env.PASSWORD;
    const firstname = process.env.FIRSTNAME
    const lastname = process.env.LASTNAME

    if (!email || !password || !firstname || !lastname) {
        throw new Error("variables is not defined in .env")
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) return;

    await this.prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        isAdmin: true,
        firstname,
        lastname,
        profile_picture: "default_avatar.jpg"
      },
    });

    console.log('Admin user created');
  }
}