import mongoose from 'mongoose';

const appSchema = new mongoose.Schema({
  app_name: { type: String, unique: true },
  app_status: Number, // 0 - hidden, 1 - active, 2 - deleted
}, { timestamps: { createdAt: 'app_created_at', updatedAt: 'app_updated_at' } });

export default mongoose.model('App', appSchema);
