import { Categoray } from 'src/categoray/entities/categoray.entity';
import { PaymentDate } from 'src/dates/entities/date.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Member } from 'src/members/entities/member.entity'; // Import Member entity

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Phone: string;

  @Column()
  WorkingPlace: string;

  @Column()
  Name: string;

  @Column()
  Gender: string;


  // One-to-many relationship with Member
  @OneToMany(() => Member, (member) => member.customer)
  members: Member[];  // This property will store the related members for a customer

  // Many customers can be associated with one category
  

  // Define the OneToMany relationship to PaymentDate
  @OneToMany(() => PaymentDate, (paymentDate) => paymentDate.customer)
  dates: PaymentDate[];  // Add this property to store related PaymentDate entities
}
