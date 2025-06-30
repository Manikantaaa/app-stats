import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'as_created_at',
    updatedAt: 'as_updated_at',
  },
})
export class AppStats extends Document {
  // MongoDB ObjectId will be _id

  @Prop({ required: true })
  as_date: Date;

  @Prop({ type: Types.ObjectId, ref: 'UserApp', required: true })
  as_ua_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AppApi', required: true })
  as_ai_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  as_count: number;

  @Prop({ type: Number, default: 1 }) // 1=active
  as_status: number;
}

export const AppStatsSchema = SchemaFactory.createForClass(AppStats);
