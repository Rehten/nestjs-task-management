import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    public getTasks(@Query() filterDto: FilterTasksDto): Task[] {
        return this.tasksService.getTasks(filterDto);
    }

    @Get('/:id')
    public getTaskById(@Param('id') id: string): Task {
        const task: Task = this.tasksService.getTaskById(id);

        if (task) {
            return task;
        } else {
            throw Error(`Task with id ${id} is not found`);
        }
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
