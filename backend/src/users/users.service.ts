import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User} from './schemas/user.schema'; 
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getUsers() {
    return this.userModel.find({ u_status: { $ne: 2 } }).sort({ u_created_at: -1 });
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userModel.findOne({ u_email: data.email });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(data.password, user.u_password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    return {
      id: user._id,
      name: `${user.u_firstname} ${user.u_lastname}`,
      email: user.u_email,
      role: user.u_role,
    };
  }

  async verify(email: string) {
    const user = await this.userModel.findOne({ u_email: email });
    if (!user) throw new UnauthorizedException('User not found');

    return {
      id: user._id,
      name: `${user.u_firstname} ${user.u_lastname}`,
      email: user.u_email,
      role: user.u_role,
    };
  }

   async addUser(data: CreateUserDto) {

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new this.userModel({
      u_firstname: data.firstname,
      u_lastname: data.lastname,
      u_email: data.email,
      u_password: hashedPassword,
      u_role: parseInt(data.role),
      u_status: parseInt(data.status),
    });
    return newUser.save();
  }

  
 async updateUser(id: string, data: UpdateUserDto) {
    const updateData: any = {};
    if (data.firstname !== undefined) updateData.u_firstname = data.firstname;
    if (data.lastname !== undefined) updateData.u_lastname = data.lastname;
    if (data.email !== undefined) updateData.u_email = data.email;
    if (data.status !== undefined) updateData.u_status = parseInt(data.status);
    if (data.role !== undefined) updateData.u_role = parseInt(data.role);

    return this.userModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
  }


  async toggleUserStatus(id: string, status: number) {
    return this.userModel.findByIdAndUpdate(id, { u_status: status }, { new: true });
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
