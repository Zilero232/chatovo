import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  EditMessageDto,
  ListMessagesQueryDto,
  SendMessageDto,
  UploadAttachmentDto
} from './dto/chat.dto';
import { ChatAttachmentService, ChatMessageService } from './services';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly attachments: ChatAttachmentService,
    private readonly messages: ChatMessageService
  ) {}

  @Post('attachments')
  @UseInterceptors(FileInterceptor('file'))
  uploadAttachment(
    @Body() body: UploadAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userId: string
  ) {
    return this.attachments.uploadAttachment({ roomId: body.roomId, file, userId });
  }

  @Post('messages')
  sendMessage(@Body() body: SendMessageDto, @CurrentUser() userId: string) {
    return this.messages.sendMessage({ input: body, senderId: userId });
  }

  @Get('messages')
  listMessages(@Query() query: ListMessagesQueryDto, @CurrentUser() userId: string) {
    return this.messages.listMessages({ query, userId });
  }

  @Patch('messages/:id')
  editMessage(
    @Param('id') messageId: string,
    @Body() body: EditMessageDto,
    @CurrentUser() userId: string
  ) {
    return this.messages.editMessage({ messageId, input: body, senderId: userId });
  }

  @Delete('messages/:id')
  deleteMessage(@Param('id') messageId: string, @CurrentUser() userId: string) {
    return this.messages.deleteMessage({ messageId, userId });
  }
}
