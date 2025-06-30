import mongoose from 'mongoose';

const userRoleSchema = new mongoose.Schema({
  ur_role: { type: Number, unique: true },
}, { timestamps: { createdAt: 'ur_created_at', updatedAt: 'ur_updated_at' } });

export default mongoose.model('UserRole', userRoleSchema);
