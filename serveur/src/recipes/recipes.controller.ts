import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { SearchRecipesDto } from './dto/search-recipes.dto';
import { RecipesService } from './recipes.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

type UploadedRecipeImage = {
  filename: string;
  mimetype: string;
  size: number;
};
@ApiTags('recipes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOperation({
    summary: 'Créer une recette',
  })
  @ApiCreatedResponse({
    description: 'Recette créée.',
  })
  @Post()
  create(
    @Request() request: { user: { id: string; email: string } },
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    return this.recipesService.create(request.user.id, createRecipeDto);
  }

  @ApiOperation({
    summary: 'Lister les recettes',
  })
  @ApiOkResponse({
    description: 'Liste des recettes.',
  })
  @Get()
  findAll(@Request() request: { user: { id: string; email: string } }) {
    return this.recipesService.findAll(request.user.id);
  }

  @ApiOperation({
    summary: 'Récupérer une recette',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @ApiOperation({
    summary: 'Rechercher des recettes',
  })
  @Get('search')
  search(
    @Request() request: { user: { id: string; email: string } },
    @Query() filters: SearchRecipesDto,
  ) {
    return this.recipesService.search(request.user.id, filters);
  }
  @ApiOperation({
    summary: 'Ajouter une image pour une recette',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          const uploadDirectory = join(process.cwd(), 'uploads', 'recipes');

          mkdirSync(uploadDirectory, {
            recursive: true,
          });

          callback(null, uploadDirectory);
        },

        filename: (_request, file, callback) => {
          const extension = extname(file.originalname).toLowerCase();

          callback(null, `${randomUUID()}${extension}`);
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (_request, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              'Seules les images JPG, PNG et WebP sont autorisées.',
            ),
            false,
          );

          return;
        }

        callback(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file?: UploadedRecipeImage) {
    if (!file) {
      throw new BadRequestException('Aucune image valide n’a été fournie.');
    }

    return {
      imageUrl: `/uploads/recipes/${file.filename}`,
    };
  }
  @Get(':id')
  findOne(
    @Request() request: { user: { id: string; email: string } },
    @Param('id') id: string,
  ) {
    return this.recipesService.findOne(id, request.user.id);
  }

  @ApiOperation({
    summary: 'Modifier une recette',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @Patch(':id')
  update(
    @Request() request: { user: { id: string; email: string } },
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, request.user.id, updateRecipeDto);
  }

  @ApiOperation({
    summary: 'Supprimer une recette',
  })
  @ApiNotFoundResponse({
    description: 'Recette introuvable.',
  })
  @Delete(':id')
  remove(
    @Request() request: { user: { id: string; email: string } },
    @Param('id') id: string,
  ) {
    return this.recipesService.remove(id, request.user.id);
  }
}
