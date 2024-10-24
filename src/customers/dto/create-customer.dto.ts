import { Categoray } from "src/categoray/entities/categoray.entity";

export class CreateCustomerDto {
    Name : string;
    Phone : string;
    WorkingPlace: string;
    Gender: string;
    categoryId: any
}
