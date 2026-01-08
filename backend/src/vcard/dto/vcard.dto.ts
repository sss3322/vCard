import { IsString, IsOptional, ValidateNested, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContactDetailDto {
    @IsString()
    type: string; 

    @IsString()
    value: string;
}

export class CreateSocialLinkDto {
    @IsString()
    platform: string;

    @IsString()
    url: string;
}

export class CreateWebLinkDto {
    @IsString()
    title: string;

    @IsString()
    url: string;
}

export class CreateVCardDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    heading?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    jobTitle?: string;

    @IsOptional()
    @IsString()
    companyName?: string;

    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateContactDetailDto)
    @IsOptional()
    contactDetails?: CreateContactDetailDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSocialLinkDto)
    @IsOptional()
    socialLinks?: CreateSocialLinkDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateWebLinkDto)
    @IsOptional()
    webLinks?: CreateWebLinkDto[];
}

export class UpdateVCardDto extends CreateVCardDto { }
