import {
    Body,
    Controller,
    Delete,
    Get, Logger,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.status';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger();

    constructor(private tasksService: TasksService) {
    }

    @Get()
    public async getTasks(
        @Query(ValidationPipe) filterDto: FilterTasksDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    public async getTaskById(
        @Param('id') id: string,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    public async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Patch('/:id/')
    public async patchTask(
        @Param('id') id: string,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.patchTask(id, status, user);
    }

    @Delete('/:id')
    public async deleteTask(
        @Param('id') id: string,
        @GetUser() user: User,
    ): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }
}
