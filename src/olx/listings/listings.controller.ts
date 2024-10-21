import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Types } from 'mongoose';

@Controller('/olx/local/listings')
export class ListingsController {
  private readonly logger = new Logger(ListingsController.name);

  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  create(@Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(createListingDto);
  }

  @Post('/bulk')
  createMany(@Body() listings: CreateListingDto[]) {
    return this.listingsService.createMany(listings);
  }

  @Get()
  findAll(@Query() params: string[]) {
    const neighborhood = params['neighborhood'];

    this.logger.log(`neighborhood: ${neighborhood}`);

    if (neighborhood) {
      return this.listingsService.findAllByNeighbourhood(neighborhood);
    }
    return this.listingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.listingsService.remove(id);
  }
}
