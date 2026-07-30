import { Module } from '@nestjs/common';
import { MealPlansService } from './meal-plans.service';
import { MealPlansController } from './meal-plans.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MealPlansController],
  providers: [MealPlansService],
})
export class MealPlansModule {}
