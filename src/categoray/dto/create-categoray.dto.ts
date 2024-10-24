export class CreateCategorayDto {
    Amount : number;
    Start : Date;
    End: Date;
    IsCompleted: boolean;
    Members: number[];  // This should be a list of customer IDs
    customerId:any;
    categoryId :any;
}
