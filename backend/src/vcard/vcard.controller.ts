import { Controller, Post, Body, Get, Patch, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { VCardService } from './vcard.service';
import { CreateVCardDto, UpdateVCardDto } from './dto/vcard.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('vcard')
export class VCardController {
    constructor(private readonly vCardService: VCardService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req: any, @Body() dto: CreateVCardDto) {
        return this.vCardService.create(req.user.userId, dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    findMyCard(@Request() req: any) {
        return this.vCardService.findOne(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch()
    update(@Request() req: any, @Body() dto: UpdateVCardDto) {
        return this.vCardService.update(req.user.userId, dto);
    }

    @Get(':userId')
    findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.vCardService.findOne(userId);
    }
}
