import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVCardDto, UpdateVCardDto } from './dto/vcard.dto';

@Injectable()
export class VCardService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, dto: CreateVCardDto) {
        const existing = await this.prisma.vCard.findUnique({
            where: { userId },
        });
        if (existing) {
            throw new ConflictException('User already has a vCard');
        }

        return this.prisma.vCard.create({
            data: {
                userId,
                name: dto.name,
                heading: dto.heading,
                description: dto.description,
                jobTitle: dto.jobTitle,
                companyName: dto.companyName,
                videoUrl: dto.videoUrl,
                contactDetails: {
                    create: dto.contactDetails,
                },
                socialLinks: {
                    create: dto.socialLinks,
                },
                webLinks: {
                    create: dto.webLinks,
                },
            },
            include: {
                contactDetails: true,
                socialLinks: true,
                webLinks: true,
            },
        });
    }

    async findOne(userId: number) {
        const card = await this.prisma.vCard.findUnique({
            where: { userId },
            include: {
                contactDetails: true,
                socialLinks: true,
                webLinks: true,
            },
        });
        return card;
    }

    async update(userId: number, dto: UpdateVCardDto) {
        const existing = await this.prisma.vCard.findUnique({
            where: { userId },
        });
        if (!existing) {
            throw new NotFoundException('vCard not found');
        }

        return this.prisma.$transaction(async (tx) => {
            await tx.vCard.update({
                where: { userId },
                data: {
                    name: dto.name,
                    heading: dto.heading,
                    description: dto.description,
                    jobTitle: dto.jobTitle,
                    companyName: dto.companyName,
                    videoUrl: dto.videoUrl,
                }
            });

            if (dto.contactDetails) {
                await tx.contactDetail.deleteMany({ where: { vCardId: existing.id } });
                await tx.contactDetail.createMany({
                    data: dto.contactDetails.map(c => ({ ...c, vCardId: existing.id }))
                });
            }

            if (dto.socialLinks) {
                await tx.socialLink.deleteMany({ where: { vCardId: existing.id } });
                await tx.socialLink.createMany({
                    data: dto.socialLinks.map(s => ({ ...s, vCardId: existing.id }))
                });
            }

            if (dto.webLinks) {
                await tx.webLink.deleteMany({ where: { vCardId: existing.id } });
                await tx.webLink.createMany({
                    data: dto.webLinks.map(w => ({ ...w, vCardId: existing.id }))
                });
            }

            return tx.vCard.findUnique({
                where: { userId },
                include: { contactDetails: true, socialLinks: true, webLinks: true }
            });
        });
    }
}
