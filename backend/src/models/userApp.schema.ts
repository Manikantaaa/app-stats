import mongoose from 'mongoose';

const userAppSchema = new mongoose.Schema({
  ua_u_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ua_app_id: { type: mongoose.Schema.Types.ObjectId, ref: 'App' },
  ua_status: Number, // 0 - hidden, 1 - active, 2 - deleted
}, { timestamps: { createdAt: 'ua_created_at', updatedAt: 'ua_updated_at' } });

export default mongoose.model('UserApp', userAppSchema);
