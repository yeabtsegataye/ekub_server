import { Module } from '@nestjs/common';
import { CategorayService } from './categoray.service';
import { CategorayController } from './categoray.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoray } from './entities/categoray.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Member } from 'src/members/entities/member.entity';
import { PaymentDate } from 'src/dates/entities/date.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoray,Customer,Member,PaymentDate])],

  controllers: [CategorayController],
  providers: [CategorayService],
})
export class CategorayModule {}
