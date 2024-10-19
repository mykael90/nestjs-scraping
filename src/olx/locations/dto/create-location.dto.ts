import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ExtraDataDto {
  @IsString()
  friendlyPath: string;
}

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsString()
  value: string;

  @IsString()
  parentId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ExtraDataDto)
  extraData?: ExtraDataDto;
}
