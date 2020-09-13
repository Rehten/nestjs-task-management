import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.status';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    public getTasks(@Query(ValidationPipe) filterDto: FilterTasksDto): Task[] {
        return this.tasksService.getTasks(filterDto);
    }

    @Get('/:id')
    public getTaskById(@Param('id') id: string): Task {
        const task: Task = this.tasksService.getTaskById(id);

        return task;
    }

    @Post()
    @UsePipes(ValidationPipe)
    public createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch('/:id/')
    patchTask(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Task {
        return this.tasksService.patchTask(id, status);
    }

    @Delete('/:id')
    public deleteTask(@Param('id') id: string): void {
        return this.tasksService.deleteTask(id);
    }
}
