import { Injectable, Logger } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Listing } from './entities/listing.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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

  async findAllByNeighbourhood(neighborhood: string) {
    return await this.listingModel
      .find()
      .where('neighborhood')
      .equals(neighborhood)
      .populate('location')
      .exec();
  }
  async findOne(id: Types.ObjectId) {
    return `This action returns a #${id} listing`;
  }

  async update(id: Types.ObjectId, updateListingDto: UpdateListingDto) {
    return await this.listingModel.findByIdAndUpdate(id, updateListingDto);
  }

  async remove(id: Types.ObjectId) {
    return `This action removes a #${id} listing`;
  }
}
