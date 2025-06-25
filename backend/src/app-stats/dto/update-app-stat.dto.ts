import { PartialType } from '@nestjs/mapped-types';
import { CreateAppStatDto } from './create-app-stat.dto';

export class UpdateAppStatDto extends PartialType(CreateAppStatDto) {}
