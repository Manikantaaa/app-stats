import mongoose from 'mongoose';

const appApiSchema = new mongoose.Schema({
  ai_name: String,
  ai_status: Number, // 0 - hidden, 1 - active, 2 - deleted
}, { timestamps: { createdAt: 'ai_created_at', updatedAt: 'ai_updated_at' } });

export default mongoose.model('AppApi', appApiSchema);
