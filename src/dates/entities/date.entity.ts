import { Customer } from 'src/customers/entities/customer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Categoray } from 'src/categoray/entities/categoray.entity';

@Entity()
export class PaymentDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:null})
  Amount: number;

  @Column()
  PaymentDate: Date; // Rename the property to avoid conflict

  // Define the relationship with the Customer entity
  @ManyToOne(() => Customer, (customer) => customer.dates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' }) // Foreign key column
  customer: Customer;

  // Many PaymentDates belong to one Categoray
  @ManyToOne(() => Categoray, (category) => category.paymentDates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' }) // This will create a foreign key column named 'categoryId'
  category: Categoray;

  @Column()
  customerId: number; // Add a column to store the foreign key
}
