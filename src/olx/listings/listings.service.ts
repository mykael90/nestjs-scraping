import { Injectable, Logger } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Listing } from './entities/listing.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ListingsService {
  private readonly logger = new Logger(ListingsService.name);
  constructor(
    @InjectModel('Listing') private readonly listingModel: Model<Listing>,
  ) {}
  async create(createListingDto: CreateListingDto) {
    try {
      const categoryCreated = new this.listingModel(createListingDto);
      return await categoryCreated.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      return error;
    }
  }

  async createMany(listings: CreateListingDto[]) {
    try {
      return await this.listingModel.insertMany(listings);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      return error;
    }
  }

  async findAll() {
    return await this.listingModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} listing`;
  }

  update(id: number, updateListingDto: UpdateListingDto) {
    return `This action updates a #${id} listing`;
  }

  remove(id: number) {
    return `This action removes a #${id} listing`;
  }
}
