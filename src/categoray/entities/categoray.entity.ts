import { PaymentDate } from 'src/dates/entities/date.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Member } from 'src/members/entities/member.entity'; // Import Member entity

@Entity()
export class Categoray {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Amount: number;

  @Column({ nullable: true })
  Start: Date;

  @Column({ nullable: true })
  End: Date;

  @Column({ default: false })
  IsCompleted: boolean;

   // One-to-many relationship with Member
   @OneToMany(() => Member, (member) => member.categoray)
   members: Member[];  // This property will store the related members for a category
   
  // One category can have many payment dates
  @OneToMany(() => PaymentDate, (paymentDate) => paymentDate.category)
  paymentDates: PaymentDate[];  // List of related payment dates
}
