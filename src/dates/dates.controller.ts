import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatesService } from './dates.service';
import { CreateDateDto } from './dto/create-date.dto';
import { UpdateDateDto } from './dto/update-date.dto';

@Controller('dates')
export class DatesController {
  constructor(private readonly datesService: DatesService) {}

  @Post('add')
  create(@Body() createDateDto: CreateDateDto[]) {
    return this.datesService.create(createDateDto);
  }

  @Get('get')
  findAll() {
    return this.datesService.findAll();
  }

  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.datesService.findOne(+id);
  }

  @Patch('update')
  update( @Body() updateDateDto: UpdateDateDto[]) {
    return this.datesService.updateMultiple(updateDateDto);
  }
  @Patch('addUsers')
  addUsersToCategory( @Body() updateDateDto: UpdateDateDto) {
    return this.datesService.addUsersToCategory(updateDateDto);
  }
  
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.datesService.remove(+id);
  }
}
