import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategorayService } from './categoray.service';
import { CreateCategorayDto } from './dto/create-categoray.dto';
import { UpdateCategorayDto } from './dto/update-categoray.dto';

@Controller('categoray')
export class CategorayController {
  constructor(private readonly categorayService: CategorayService) {}

  @Post('add')
  create(@Body() createCategorayDto: CreateCategorayDto) {
    return this.categorayService.create(createCategorayDto);
  }

  @Get('get')
  findAll() {
    return this.categorayService.findAll();
  }

  @Get('history')
  History() {
    return this.categorayService.History();
  }

  @Get('getone/:id')
  findOne(@Param('id') id: string) {
    return this.categorayService.findOne(+id);
  }


  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateCategorayDto: UpdateCategorayDto) {
    return this.categorayService.update(+id, updateCategorayDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.categorayService.remove(+id);
  }
}
