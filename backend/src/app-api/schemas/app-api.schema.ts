import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'ai_created_at',
    updatedAt: 'ai_updated_at',
  },
})
export class AppApi extends Document {
  @Prop({ required: true })
  ai_name: string;

  @Prop({ type: Number, default: 1 }) // you can adjust default if needed
  ai_status: number;
}

export const AppApiSchema = SchemaFactory.createForClass(AppApi);
