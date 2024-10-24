import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Categoray } from 'src/categoray/entities/categoray.entity';
import { Customer } from 'src/customers/entities/customer.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  // Foreign key to Categoray
  @ManyToOne(() => Categoray, (categoray) => categoray.id, { onDelete: 'CASCADE' })  // 'CASCADE' will delete member if Categoray is deleted
  @JoinColumn({ name: 'categorayId' })  // Specifies the foreign key column
  categoray: Categoray;

  // Foreign key to Customer
  @ManyToOne(() => Customer, (customer) => customer.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })  // Specifies the foreign key column
  customer: Customer;

  // Automatically managed creation timestamp
  @CreateDateColumn()
  createdAt: Date;

  // Automatically managed update timestamp
  @UpdateDateColumn()
  updatedAt: Date;
}
