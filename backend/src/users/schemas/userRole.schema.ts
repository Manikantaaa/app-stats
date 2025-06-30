import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'ur_created_at',
    updatedAt: 'ur_updated_at',
  },
})
export class UserRole extends Document {
  // _id: MongoDB ObjectId automatically present

  @Prop({ type: Number, unique: true, required: true })
  ur_role: number;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
