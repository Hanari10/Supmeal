import { PartialType } from '@nestjs/swagger';
import { CreateShoppingListItemDto } from './create-shopping-list-item.dto';

export class UpdateShoppingListItemDto extends PartialType(
  CreateShoppingListItemDto,
) {}
