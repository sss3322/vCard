import { Module } from '@nestjs/common';
import { VCardService } from './vcard.service';
import { VCardController } from './vcard.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VCardController],
  providers: [VCardService],
})
export class VCardModule { }
