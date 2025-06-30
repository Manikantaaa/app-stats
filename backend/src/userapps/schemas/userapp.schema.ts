import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema({timestamps : {
    createdAt: 'ua_created_at',
    updatedAt:'ua_updated_at',
}})
export class UserApp  extends Document{
    @Prop({type: Types.ObjectId, ref:'User', required: true})
    ua_u_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'App', required: true })
    ua_app_id: Types.ObjectId;

    @Prop({ type: Number, default: 1 }) // 1 = active
    ua_status: number;
}

export const UserAppSchema = SchemaFactory.createForClass(UserApp);