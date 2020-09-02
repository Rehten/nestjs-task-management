import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {
    }

    @Get()
    public getAllTasks(): Task[] {
        return this.tasksService.getAllTasks();
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
    public createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch('/:id/:status')
    patchTask(@Param('id') id: string, @Param('status') status: TaskStatus): Task {
        return this.tasksService.patchTask(id, status);
    }

    @Delete('/:id')
    public deleteTask(@Param('id') id: string): void {
        return this.tasksService.deleteTask(id);
    }
}
