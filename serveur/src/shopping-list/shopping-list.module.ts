import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
})
export class ShoppingListModule {}
