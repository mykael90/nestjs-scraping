import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'listings' })
export class Listing extends Document {
  @Prop()
  subject: string;

  @Prop()
  title: string;

  @Prop()
  price: string;

  @Prop({ unique: true })
  listId: string;

  @Prop()
  lastBumpAgeSecs: string;

  @Prop()
  oldPrice: string;

  @Prop()
  professionalAd: boolean;

  @Prop()
  priceReductionBadge: boolean;

  @Prop()
  userGoogleReviewsVisible: boolean;

  @Prop()
  userGoogleRating: number | null;

  @Prop()
  isFeatured: boolean;

  @Prop()
  listingCategoryId: string;

  @Prop({
    type: [
      {
        original: String,
        originalAlt: String,
        originalWebP: String,
        thumbnail: String,
      },
    ],
  })
  images: Array<{
    original: string;
    originalAlt: string;
    originalWebP: string;
    thumbnail: string;
  }>;

  @Prop()
  videoCount: number;

  @Prop()
  videos: string[];

  @Prop()
  isChatEnabled: boolean;

  @Prop()
  fixedOnTop: boolean;

  @Prop()
  url: string;

  @Prop()
  thumbnail: string;

  @Prop()
  date: Date;

  @Prop()
  imageCount: number;

  @Prop()
  location: string;

  @Prop({
    type: {
      municipality: String,
      ddd: String,
      neighbourhood: String,
      uf: String,
    },
  })
  locationDetails: {
    municipality: string;
    ddd: string;
    neighbourhood: string;
    uf: string;
  };

  @Prop()
  category: string;

  @Prop()
  searchCategoryLevelZero: number;

  @Prop()
  searchCategoryLevelOne: number;

  @Prop({
    type: [
      {
        name: String,
        label: String,
        value: String,
      },
    ],
  })
  properties: Array<{
    name: string;
    label: string;
    value: string;
  }>;

  @Prop({
    type: {
      isOnline: Boolean,
    },
  })
  accountActivityStatus: {
    isOnline: boolean;
  };

  @Prop({
    type: {
      enabled: Boolean,
      dynamicBadgeProps: Array,
      transactionalBadges: Array,
      installments: Array,
      isCategoryEligible: Boolean,
    },
  })
  olxPay: {
    enabled: boolean;
    dynamicBadgeProps: any[];
    transactionalBadges: any[];
    installments: any[];
    isCategoryEligible: boolean;
  };

  @Prop()
  olxPayBadgeEnabled: boolean;

  @Prop({
    type: {
      enabled: Boolean,
      weight: Number,
    },
  })
  olxDelivery: {
    enabled: boolean;
    weight: number | null;
  };

  @Prop()
  olxDeliveryBadgeEnabled: boolean;

  @Prop()
  installments: boolean;

  @Prop()
  isFavorited: boolean;

  @Prop()
  hasRealEstateHighlight: boolean;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
