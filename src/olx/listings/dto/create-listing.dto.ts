import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class ImageDto {
  @IsString()
  original: string;

  @IsString()
  originalAlt: string;

  @IsString()
  originalWebP: string;

  @IsString()
  thumbnail: string;
}

class LocationDetailsDto {
  @IsString()
  municipality: string;

  @IsString()
  ddd: string;

  @IsString()
  neighbourhood: string;

  @IsString()
  uf: string;
}

class PropertyDto {
  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsString()
  value: string;
}

class AccountActivityStatusDto {
  @IsBoolean()
  isOnline: boolean;
}

class OlxPayDto {
  @IsBoolean()
  enabled: boolean;

  @IsArray()
  @IsOptional()
  dynamicBadgeProps: any[];

  @IsArray()
  @IsOptional()
  transactionalBadges: any[];

  @IsArray()
  @IsOptional()
  installments: any[];

  @IsBoolean()
  isCategoryEligible: boolean;
}

class OlxDeliveryDto {
  @IsBoolean()
  enabled: boolean;

  @IsOptional()
  @IsNumber()
  weight: number | null;
}

export class CreateListingDto {
  @IsString()
  subject: string;

  @IsString()
  title: string;

  @IsString()
  price: string;

  @IsNumber()
  listId: number;

  @IsString()
  lastBumpAgeSecs: string;

  @IsString()
  oldPrice: string;

  @IsBoolean()
  professionalAd: boolean;

  @IsBoolean()
  priceReductionBadge: boolean;

  @IsBoolean()
  userGoogleReviewsVisible: boolean;

  @IsOptional()
  @IsNumber()
  userGoogleRating: number | null;

  @IsBoolean()
  isFeatured: boolean;

  @IsString()
  listingCategoryId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];

  @IsNumber()
  videoCount: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  videos: string[];

  @IsBoolean()
  isChatEnabled: boolean;

  @IsBoolean()
  fixedOnTop: boolean;

  @IsString()
  url: string;

  @IsString()
  thumbnail: string;

  @IsDate()
  // @Type(() => Date)
  @Transform(({ value }) => {
    // Verifica se o valor é um número e converte para milissegundos
    return value ? new Date(value * 1000) : null;
  })
  date: Date;

  @IsNumber()
  imageCount: number;

  @IsString()
  location: string;

  @ValidateNested()
  @Type(() => LocationDetailsDto)
  locationDetails: LocationDetailsDto;

  @IsString()
  category: string;

  @IsNumber()
  searchCategoryLevelZero: number;

  @IsNumber()
  searchCategoryLevelOne: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDto)
  properties: PropertyDto[];

  @ValidateNested()
  @Type(() => AccountActivityStatusDto)
  accountActivityStatus: AccountActivityStatusDto;

  @ValidateNested()
  @Type(() => OlxPayDto)
  olxPay: OlxPayDto;

  @IsBoolean()
  olxPayBadgeEnabled: boolean;

  @ValidateNested()
  @Type(() => OlxDeliveryDto)
  olxDelivery: OlxDeliveryDto;

  @IsBoolean()
  olxDeliveryBadgeEnabled: boolean;

  @IsBoolean()
  installments: boolean;

  @IsBoolean()
  isFavorited: boolean;

  @IsBoolean()
  hasRealEstateHighlight: boolean;
}
