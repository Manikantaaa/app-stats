import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  u_role: Number,
  u_firstname: String,
  u_lastname: String,
  u_email: { type: String, unique: true },
  u_password: String,
  u_status: Number, // 0 - hidden, 1 - active, 2 - deleted
}, { timestamps: { createdAt: 'u_created_at', updatedAt: 'u_updated_at' } });

export default mongoose.model('User', userSchema);
