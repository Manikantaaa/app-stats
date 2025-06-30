import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import User from '../models/user.schema';

@Injectable()
export class UsersService {
  async getUsers() {
    return User.find({ u_status: { $ne: 2 } }).sort({ u_created_at: -1 });
  }

  async login(data: { email: string; password: string }) {
    try {
      const user = await User.findOne({ u_email: data.email });
      if (!user) throw new UnauthorizedException('Invalid email or password');

      const isMatch = await bcrypt.compare(data.password, user.u_password);
      if (!isMatch) throw new UnauthorizedException('Invalid email or password');

      return {
        id: user._id,
        name: `${user.u_firstname} ${user.u_lastname}`,
        email: user.u_email,
        role: user.u_role,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('An error occurred during login');
    }
  }

  async verify(email: string) {
    const user = await User.findOne({ u_email: email });
    if (!user) throw new UnauthorizedException('User not found');

    return {
      id: user._id,
      name: `${user.u_firstname} ${user.u_lastname}`,
      email: user.u_email,
      role: user.u_role,
    };
  }

  async addUser(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    status: string;
    role: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new User({
      u_firstname: data.firstname,
      u_lastname: data.lastname,
      u_email: data.email,
      u_password: hashedPassword,
      u_role: parseInt(data.role),
      u_status: parseInt(data.status),
    });
    return newUser.save();
  }

  async updateUser(id: string, data: {
    firstname: string;
    lastname: string;
    email: string;
    status: string;
  }) {
    return User.findByIdAndUpdate(id, {
      u_firstname: data.firstname,
      u_lastname: data.lastname,
      u_email: data.email,
      u_status: parseInt(data.status),
    }, { new: true });
  }

    

  async toggleUserStatus(id: string, status: number) {
    return User.findByIdAndUpdate(id, { u_status: status }, { new: true });
  }

  async deleteUser(id: string) {
    return User.findByIdAndUpdate(id, { u_status: 2 }, { new: true });
  }
}
