import { PartialType } from '@nestjs/mapped-types';
import { CreateCategorayDto } from './create-categoray.dto';

export class UpdateCategorayDto extends PartialType(CreateCategorayDto) {}
