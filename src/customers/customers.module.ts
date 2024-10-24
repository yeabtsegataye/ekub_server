import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoray } from 'src/categoray/entities/categoray.entity';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoray, Customer])],

  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
