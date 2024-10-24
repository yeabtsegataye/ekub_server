import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDateDto } from './dto/create-date.dto';
import { UpdateDateDto } from './dto/update-date.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentDate } from './entities/date.entity';
import { Repository } from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { Categoray } from 'src/categoray/entities/categoray.entity';

@Injectable()
export class DatesService {
  constructor(
    @InjectRepository(PaymentDate)
    private readonly paymentDateRepository: Repository<PaymentDate>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Categoray)
    private readonly categorayRepository: Repository<Categoray>,
  ) {}

  // async create(createDateDto: CreateDateDto) {
  //   try {
  //     // Find the customer entity
  //     const customer = await this.customerRepository.findOne({
  //       where: { id: createDateDto.customerId },
  //     });
  
  //     if (!customer) {
  //       return { error: 'የተፈለገው ሰው አልተገኘም በድጋሚ ይሞልሩ' };
  //     }
  
  //     // Find the category entity
  //     const category = await this.categorayRepository.findOne({
  //       where: { id: createDateDto.categoryId },
  //     });
  
  //     if (!category) {
  //       return { error: 'የተፈለገው እቁብ አልተገኘም እባክዎ እቁቡን ያስገቡ' };
  //     }
      
  //     // Create a new PaymentDate entity and assign customer and category entities
  //     const paymentDate = this.paymentDateRepository.create({
  //       Amount: createDateDto.Amount,
  //       PaymentDate: createDateDto.PaymentDate,
  //       customer,  // Assign customer entity
  //       category,  // Assign category entity
  //     });
  // console.log(paymentDate,'final')
  //     // Save to the database
  //     return await this.paymentDateRepository.save(paymentDate);
  //   } catch (error) {
  //     // Handle errors appropriately
  //     return { error: 'የውስጥ ችግር ስለተፈጠረ መልሰው ይሞክሩ', re: error.message };
  //   }
  // }
  
  async create(createDateDtos: CreateDateDto[]) {
    console.log(createDateDtos,' from sv')
    
    try {
      const paymentDates = [];
  
      for (const createDateDto of createDateDtos) {
        // Check if the customer exists
        const customer = await this.customerRepository.findOne({
          where: { id: createDateDto.customerId },
        });
  
        if (!customer) {
          return { error: `Customer with ID ${createDateDto.customerId} not found.` };
        }
  
        // Check if the category exists
        const category = await this.categorayRepository.findOne({
          where: { id: createDateDto.categoryId },
        });
  
        if (!category) {
          return { error: `Category with ID ${createDateDto.categoryId} not found.` };
        }
  
        // Create a new PaymentDate entity for each item and assign customer and category entities
        const paymentDate = this.paymentDateRepository.create({
          Amount: createDateDto.Amount,
          PaymentDate: createDateDto.PaymentDate,
          customer,  // Assign customer entity
          category,  // Assign category entity
        });
  
        // Add to the list of paymentDates
        paymentDates.push(paymentDate);
      }
  
      // Save all paymentDates to the database in one go
      return await this.paymentDateRepository.save(paymentDates);
    } catch (error) {
      // Handle errors appropriately
      return { error: 'የውስጥ ችግር ስለተፈጠረ መልሰው ይሞክሩ', re: error.message };
    }
  }
  
  async addUsersToCategory(updateDateDto: UpdateDateDto) {
    const checkCategory = await this.categorayRepository.findOne({
      where: { id: updateDateDto.categoryId },
    });
  
    if (checkCategory) {
      const query = `
        INSERT INTO payment_date (Amount, PaymentDate, customerId, categoryId)
        VALUES (?, ?, ?, ?);
      `;
  
      // Loop through the userIds array to add each user with the same payment date and amount
      for (const userId of updateDateDto.userIds) {
        const params = [
          0, // Amount is set to 0
          updateDateDto.paymentDate, // PaymentDate
          userId, // customerId
          checkCategory.id, // categoryId
        ];
  
        try {
          // Execute the query with parameters to prevent SQL injection
          await this.paymentDateRepository.query(query, params);
          console.log(`Payment record created for userId: ${userId}`);
        } catch (error) {
          console.error(`Error adding userId: ${userId}`, error);
          throw new InternalServerErrorException(
            `Failed to add payment record for userId: ${userId}`
          );
        }
      }
  
      return { message: 'Users added successfully' };
    } else {
      throw new BadRequestException('Category not found');
    }
  }
  
  

  async findAll() {
    try {
      // Use createQueryBuilder to join PaymentDate with Customer
      const paymentDates = await this.paymentDateRepository
        .createQueryBuilder('paymentDate')
        .leftJoinAndSelect('paymentDate.customer', 'customer') // Join with the Customer entity
        // .select(['paymentDate', 'customer.Name']) // Select fields to return
        .getMany();
  
      return paymentDates;
    } catch (error) {
      return { error: 'የውስጥ ችግር ስለተፈጠረ መልሰው ይሞክሩ' };
    }
  }
  

  async findOne(id: number) {
    console.log(id,'ids')
    try {
      // Retrieve a specific payment date by its category id with customer information
      const paymentDate = await this.paymentDateRepository
        .createQueryBuilder('paymentDate')
        .leftJoinAndSelect('paymentDate.customer', 'customer') // Join with Customer
        .where('paymentDate.categoryId = :id', { id }) // Filter by the specified ID
        .getMany(); // Get the single result
  
      if (!paymentDate) {
        return { error: 'የተፈለገው ደንበኛ ስላልተገኘ መልሰው ይሞክሩ' };
      }
  
      return paymentDate;
    } catch (error) {
      return { error: 'የውስጥ ችግር ስለተፈጠረ መልሰው ይሞክሩ' };
    }
  }
  

  async updateMultiple(updateDateDtos: UpdateDateDto[]) {
    console.log(updateDateDtos,'updates')
    
    try {
      const updatedPayments = [];
  
      // Loop through each updateDateDto and perform the update
      for (const dto of updateDateDtos) {
        const { paymentDateId, Amount } = dto;
  
        // Find the payment date by ID
        const paymentDate = await this.paymentDateRepository.findOne({
          where: { id: paymentDateId },
        });
  
        if (!paymentDate) {
          return { error: `ክፍያ በId: ${paymentDateId} አልተገኘም` };
        }
  
        // Update only the Amount field
        paymentDate.Amount = Amount;
  
        // Save the updated payment date
        const updatedPayment = await this.paymentDateRepository.save(paymentDate);
        updatedPayments.push(updatedPayment); // Add the updated record to the array
      }
  
      return { success: 'ክፍያዎች በተሳካ ሁኔታ ተሻሽለዋል', data: updatedPayments };
    } catch (error) {
      // Log error or handle specific error cases
      console.error(error);
      return { error: 'ክፍያዎችን ማሻሻል አልተሳካም እባክዎ ድጋሚ ይሞክሩ' };
    }
  }
  

  async remove(id: number) {
    try {
      // Find the payment date by ID
      const paymentDate = await this.paymentDateRepository.findOne({
        where: { id },
      });

      if (!paymentDate) {
        return { error: 'የተፈለገው ክፍያ አልተገኘም በድጋሚ ይሞልሩ' };
      }

      // Remove the payment date
      await this.paymentDateRepository.remove(paymentDate);
      return { error: 'የተፈለገው ክፍያ በተሳካ ሁኔታ ጠፍቷል' };
      
    } catch (error) {
      // Handle specific errors here (e.g., log error, throw a new error)
      return { error: 'ክፍያውን ማጥፋት ስላልቻለ መልሰው ይሞክሩ' };
    }
  }
}
