import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  timestamps: {
    createdAt: "app_created_at",
    updatedAt: "app_updated_at",
  },
})
export class App extends Document {
  @Prop({ required: true, unique: true })
  app_name: string;

  @Prop({ type: Number, default: 1 }) // 0=hidden, 1=active, 2=deleted
  app_status: number;
}

export const AppSchema = SchemaFactory.createForClass(App);
