import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { RequestLoggerMiddleware } from './logging/rate-limiter-logger.middleware';
import { CustomLogger } from './logging/logger.service';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from './customers/customers.module';
import { CategorayModule } from './categoray/categoray.module';
import { DatesModule } from './dates/dates.module';
import { Categoray } from './categoray/entities/categoray.entity';
import { Customer } from './customers/entities/customer.entity';
import { PaymentDate } from './dates/entities/date.entity';
import { MembersModule } from './members/members.module';
import { Member } from './members/entities/member.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),// for env
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: Number(process.env.PORT),
      username: process.env.USER_NAME,
      password: process.env.PASSWORD,
      database: process.env.DB,
      entities: [User,Categoray,Customer,PaymentDate,Member],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    CustomersModule,
    CategorayModule,
    DatesModule,
    MembersModule,
  ],
  providers: [
    CustomLogger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
