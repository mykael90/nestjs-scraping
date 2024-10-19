import { Injectable, Logger } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);
  constructor(
    @InjectModel('Location') private readonly locationModel: Model<Location>,
  ) {}
  create(createLocationDto: CreateLocationDto) {
    return 'This action adds a new location';
  }

  async createMany(locations: CreateLocationDto[]) {
    try {
      return await this.locationModel.insertMany(locations);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      return error;
    }
  }

  async findAll() {
    return await this.locationModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  findOneByNeighborhood(neighborhood: string) {
    this.logger.log(`neighborhood: ${neighborhood}`);
    return this.locationModel.findOne({
      'extraData.friendlyPath': neighborhood,
    });
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
