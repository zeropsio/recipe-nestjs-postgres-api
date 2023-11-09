import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Request,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateTodoDto } from './dtos/create.todo.dto';
import { UpdateTodoDto } from './dtos/update.todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    if (Math.random() < 0.3) {
      this.logger.error('foo');
    }
    this.logger.log(`Request data: ${JSON.stringify(req.headers)}`);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateTodoDto) {
    return this.todosService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }
}
