import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { DataTransferService } from './data-transfer.service';

type AuthenticatedRequest = {
  user: {
    id: string;
    email: string;
  };
};
type UploadedJsonFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
};

@ApiTags('Import et export')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('data-transfer')
export class DataTransferController {
  constructor(private readonly dataTransferService: DataTransferService) {}

  @ApiOperation({
    summary: 'Exporter mes recettes et cookbooks au format JSON',
  })
  @ApiOkResponse({
    description: 'Fichier JSON généré.',
  })
  @Get('export')
  async exportData(
    @Request() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const data = await this.dataTransferService.exportUserData(request.user.id);

    const date = new Date().toISOString().slice(0, 10);

    response.setHeader('Content-Type', 'application/json');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="supmeal-export-${date}.json"`,
    );

    return response.status(200).send(data);
  }

  @ApiOperation({
    summary: 'Importer des recettes et cookbooks depuis un fichier JSON',
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
  @ApiCreatedResponse({
    description: 'Données importées avec succès.',
  })
  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  importData(
    @Request() request: AuthenticatedRequest,
    @UploadedFile() file?: UploadedJsonFile,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier JSON fourni.');
    }

    return this.dataTransferService.importUserData(
      request.user.id,
      file.buffer,
    );
  }
}
