import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'u_created_at',
    updatedAt: 'u_updated_at',
  },
})
export class User extends Document {
  @Prop({ type: Number, required: true }) // foreign key (role ID)
  u_role: number;

  @Prop({ type: String, required: true })
  u_firstname: string;

  @Prop({ type: String, required: true })
  u_lastname: string;

  @Prop({ type: String, required: true, unique: true })
  u_email: string;

  @Prop({ type: String, required: true })
  u_password: string;

  @Prop({ type: Number, default: 1 }) // 0 - hidden, 1 - active, 2 - deleted
  u_status: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
