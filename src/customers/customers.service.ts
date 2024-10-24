import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Categoray } from 'src/categoray/entities/categoray.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    // Log the received DTO
    console.log(createCustomerDto);
  
    // Validate each field individually
    const { Name, WorkingPlace, Gender, Phone } = createCustomerDto;
    
    if (!Name || !WorkingPlace || !Gender || !Phone) {
      return { error: 'ሙሉ መረጃ አልተካተተም ደግመው ያረጋግጡ' };
    }
  
    try {
      // Log the DTO before saving
      console.log('Received data:', createCustomerDto);
  
      // Create a new Customer entity
      const newCustomer = this.customerRepository.create(createCustomerDto);
  
      // Log the newly created customer before saving
      console.log('New customer object:', newCustomer);
  
      // Save the new customer to the database
      return await this.customerRepository.save(newCustomer);
    } catch (error) {
      console.error('Error occurred while saving customer:', error.message);
      return { error: 'የውስጥ ችግር ስለተፈጠረ መልሰው ይሞክሩ' };
    }
  }
  

  async findAll() {
    try {
      // Fetch all customers and join their related category
      return await this.customerRepository.find();
    } catch (error) {
      return { error: 'የውስጥ ችግር ስለተፈጠረ መልሰው ይሞክሩ' };
    }
  }

  async findOne(id: number) {
    try {
      const customer = await this.customerRepository.findOneBy({ id });
      if (!customer) {
        return { error: 'የተፈለገው ሰው አልተገኘም በድጋሚ ይሞልሩ' };
      }
      return customer;
    } catch (error) {
      return { error: 'የውስጥ ችግር ስለተፈጠረ መልሰው ይሞክሩ' };
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    if (!id) {
      return { error: 'የተፈለገው ሰው አልተገኘም በድጋሚ ይሞልሩ' };
    }
    try {
      const customer = await this.customerRepository.findOneBy({ id });

      if (!customer) {
        return { error: 'የተፈለገው ሰው አልተገኘም በድጋሚ ይሞልሩ' };
      }

      const updatedCustomer = { ...customer, ...updateCustomerDto };
      await this.customerRepository.save(updatedCustomer);

      return updatedCustomer;
    } catch (error) {
      return { error: 'የውስጥ ችግር ስለተፈጠረ መልሰው ይሞክሩ' };
    }
  }

  async remove(id: number) {
    try {
      const result = await this.customerRepository.delete(id);

      if (result.affected === 0) {
        return { error: 'የተፈለገው ሰው አልተገኘም በድጋሚ ይሞልሩ' };
      }

      return `Customer with ID #${id} has been removed successfully.`;
    } catch (error) {
      return { error: 'የውስጥ ችግር ስለተፈጠረ መልሰው ይሞክሩ' };
    }
  }
}
