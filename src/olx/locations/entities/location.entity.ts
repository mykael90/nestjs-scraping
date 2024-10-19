import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Location extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  parentId: string;

  @Prop({ type: Map, of: String })
  extraData: Record<string, string>;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
