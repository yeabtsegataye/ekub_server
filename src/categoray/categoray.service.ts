import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategorayDto } from './dto/create-categoray.dto';
import { UpdateCategorayDto } from './dto/update-categoray.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoray } from './entities/categoray.entity';
import { Repository } from 'typeorm';
import { Member } from 'src/members/entities/member.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { PaymentDate } from 'src/dates/entities/date.entity';

@Injectable()
export class CategorayService {
  constructor(
    @InjectRepository(Categoray)
    private CategorayRepository: Repository<Categoray>,
   
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,  // Inject the member repository

    @InjectRepository(Member)
    private PaymentRepository: Repository<PaymentDate>,  // Inject the member repository

    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,  // Inject the customer repository
  ) {}

  async create(createCategorayDto: CreateCategorayDto) {
    const { Amount, Start, End, IsCompleted, Members } = createCategorayDto;
  
    if (!Amount) {
      return { error: 'የእቁብ መጠን አላገቡም ' };
    }
  
    try {
      // Create new Categoray record
      const newCategoray = this.CategorayRepository.create({
        Amount,
        Start,
        End,
        IsCompleted,
      });
  
      // Save the new Categoray
      const savedCategoray = await this.CategorayRepository.save(newCategoray);
      console.log(Members, 'members');
      console.log(savedCategoray, 'saved');
  
      // Loop through the Members array and create Payment entities with Amount set to null
      for (const customerId of Members) {
        console.log(customerId, 'cuID');
  
        // Check if the customer exists in the database
        const customer = await this.customerRepository.findOne({ where: { id: customerId } });
        console.log(customer, ' custom');
  
        if (customer) {
          // Use parameterized query to insert a new Payment record securely
          const query = `
            INSERT INTO payment_date (Amount, PaymentDate, customerId, categoryId)
            VALUES (?, ?, ?, ?);
          `;
  
          const params = [
           " 0", // Amount is set to 0
            this.formatDate(new Date()), // PaymentDate
            customer.id, // customerId
            savedCategoray.id, // categoryId
          ];
  
          // Execute the query with parameters to prevent SQL injection
          await this.PaymentRepository.query(query, params);
          console.log(`Payment record created for customerId: ${customerId}`);
        } else {
          throw new BadRequestException(`Customer with ID ${customerId} not found`);
        }
      }
  
      // Return the saved Categoray with its members and their default payments
      return savedCategoray;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('A record with these details already exists.');
      } else {
        throw new InternalServerErrorException('Failed to create a new record. Please try again later.');
      }
    }
  }
  
  async History(){
   try {
    const data = await this.CategorayRepository.find({where:{IsCompleted:true}})
    if(data) {return data}
    return []
   } catch (error) {
    return { error: 'እንደዚ አይነት እቁብ የለም ወይም ጠፍቶዋል' };

   }
  }
  // Utility function to format the date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
 
  async findAll(): Promise<Categoray[]> {
    try {
      const categories = await this.CategorayRepository.find({where:{IsCompleted:false}});
      return categories;
    } catch (error) {
      throw new Error(`Failed to retrieve categories: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.CategorayRepository.findOne({
        where: { id },
      });

      if (!category) {
        return { error: 'እንደዚ አይነት እቁብ የለም ወይም ጠፍቶዋል' };
      }
      return category;
    } catch (error) {
      return { error: 'የተሳሳተ ነገር አስገብተዋል' };
    }
  }

  async update(id: number, updateCategorayDto: UpdateCategorayDto) {
    try {
      const category = await this.CategorayRepository.findOne({
        where: { id },
      });

      if (!category) {
        return { error: 'እንደዚ አይነት እቁብ የለም ወይም ጠፍቶዋል' };
      }

      // Update the category with new values
      Object.assign(category, updateCategorayDto);

      await this.CategorayRepository.save(category);

      return category;
    } catch (error) {
      return { error: 'የተሳሳተ ነገር አስገብተዋል' };    }
  }

  async remove(id: number) {
    try {
      const category = await this.CategorayRepository.findOne({ where: { id } });
      
      if (!category) {
        return { error: 'እንደዚ አይነት እቁብ የለም ወይም ጠፍቶዋል' };
      }
  
      await this.CategorayRepository.remove(category);
    } catch (error) {
      return { error: 'የተሳሳተ ነገር አስገብተዋል' };

    }
  }
  
}
