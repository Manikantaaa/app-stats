import mongoose from 'mongoose';

const appStatsSchema = new mongoose.Schema({
  as_date: Date,
  as_ua_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserApp' },
  as_ai_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AppApi' },
  as_count: Number,
  as_status: Number, // 0 - hidden, 1 - active, 2 - deleted
}, { timestamps: { createdAt: 'as_created_at', updatedAt: 'as_updated_at' } });

export default mongoose.model('AppStats', appStatsSchema);
