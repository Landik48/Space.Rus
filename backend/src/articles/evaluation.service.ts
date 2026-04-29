import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubmitTestInput } from './dto/tests.input';

@Injectable()
export class EvaluationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailableArticles(user_id: number, skip: number, take: number) {
    if (!user_id) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const articles = await this.prisma.articles.findMany({
      where: {
        test: {
          isNot: null,
        },
        NOT: {
          test: {
            results: {
              some: {
                user_id,
              },
            },
          },
        },
      },
      skip,
      take,
      orderBy: {
        id: 'asc',
      },
      include: {
        test: {
          select: {
            id: true,
          },
        },
      },
    });

    return articles.map(a => ({
      id: a.id,
      img_link: a.img_link,
      title: a.title,
      description: a.description,
      article_link: a.article_link,
      test_id: a.test?.id
    }));
  }

  async submitTest(user_id: number, input: SubmitTestInput) {
    if (!user_id) throw new UnauthorizedException();

    const test = await this.prisma.tests.findUnique({
      where: { id: input.test_id },
    });

    if (!test) throw new BadRequestException('Test not found');

    const existing = await this.prisma.testResult.findUnique({
      where: {
        user_id_test_id: {
          user_id,
          test_id: input.test_id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Test already completed');
    }

    const correctAnswers = test.answers as any[];

    let correctCount = 0;

    for (const answer of input.answers) {
      const correct = correctAnswers.find(
        (a) => a.questionId === answer.questionId,
      );

      if (correct && correct.variantId === answer.variantId) {
        correctCount++;
      }
    }

    await this.prisma.testResult.create({
      data: {
        user_id,
        test_id: input.test_id,
      },
    });

    const conditionType = 'TEST';

    const progress = await this.prisma.progress.upsert({
      where: {
        user_id_conditionType: {
          user_id,
          conditionType,
        },
      },
      create: {
        user_id,
        conditionType,
        value: correctCount,
      },
      update: {
        value: {
          increment: correctCount,
        },
      },
    });

    const newValue = progress.value;

    const achievementsToGive = await this.prisma.achievements.findMany({
      where: {
        conditionType,

        conditionValue: {
          lte: newValue,
        },

        NOT: {
          userAchievements: {
            some: {
              user_id,
            },
          },
        },
      },
      orderBy: {
        conditionValue: 'asc',
      },
    });

    for (const achievement of achievementsToGive) {
      await this.prisma.userAchievements.create({
        data: {
          user_id,
          achievement_id: achievement.id,
          date: new Date(),
        },
      });
    }

    return true;
  }

  async getTest(user_id: number, test_id: number) {
    if (!user_id) throw new UnauthorizedException();

    const test = await this.prisma.tests.findUnique({
      where: { id: test_id },
      select: {
        id: true,
        name: true,
        body: true,
      },
    });

    if (!test) throw new Error('Test not found');

    const result = await this.prisma.testResult.findUnique({
      where: {
        user_id_test_id: {
          user_id,
          test_id,
        },
      },
    });

    if (result) {
      throw new Error('Test already completed');
    }

    return test;
  }

  async getAchievements(ctx: any) {
    const user_id = ctx.req.user.userId
    const userAchievements = await this.prisma.userAchievements.findMany({
      where: { user_id },
      include: {
        achievement: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return userAchievements.map(a => ({
      id: a.achievement.id,
      title: a.achievement.title,
      description: a.achievement.description,
      image_link: a.achievement.image_link,
      date: a.date,
    }));
  }

  async getTime(ctx: any) {
    const user_id = ctx.req.user.userId;

    if (!user_id) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
      select: { total_time: true },
    });

    return user?.total_time ?? 0;
  }

  async updateTime(time: number, ctx: any) {
    const user_id = ctx.req.user.userId;

    if (!user_id) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    if (!Number.isFinite(time) || time <= 0) {
      return true;
    }

    const conditionType = 'TIME';

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: user_id },
        data: {
          total_time: {
            increment: time,
          },
        },
        select: {
          total_time: true,
        },
      });

      const totalSeconds = Math.floor(user.total_time / 100);

      await tx.progress.upsert({
        where: {
          user_id_conditionType: {
            user_id,
            conditionType,
          },
        },
        create: {
          user_id,
          conditionType,
          value: totalSeconds,
        },
        update: {
          value: totalSeconds,
        },
      });

      const achievementsToGive = await tx.achievements.findMany({
        where: {
          conditionType,
          conditionValue: {
            lte: user.total_time, 
          },
          NOT: {
            userAchievements: {
              some: {
                user_id,
              },
            },
          },
        },
        orderBy: {
          conditionValue: 'asc',
        },
      });

      for (const achievement of achievementsToGive) {
        await tx.userAchievements.create({
          data: {
            user_id,
            achievement_id: achievement.id,
            date: new Date(),
          },
        });
      }
    });

    return true;
  }

  async findCompletedArticles(user_id: number, skip: number, take: number) {
    if (!user_id) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const articles = await this.prisma.articles.findMany({
      where: {
        test: {
          is: {
            results: {
              some: {
                user_id,
              },
            },
          },
        },
      },
      skip,
      take,
      orderBy: {
        id: 'asc',
      },
      include: {
        test: {
          select: {
            id: true,
          },
        },
      },
    });

    return articles.map((a: any) => ({
      id: a.id,
      img_link: a.img_link,
      title: a.title,
      description: a.description,
      article_link: a.article_link,
      test_id: a.test?.id,
    }));
  }
}