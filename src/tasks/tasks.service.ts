import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.status';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {
    }

    public async getTasks(filterTaskDto: FilterTasksDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterTaskDto, user);
    }

    public async getTaskById(
        id: string,
        user: User,
    ): Promise<Task> {
        const found: Task = await this.taskRepository.findOne({where: {id, userId: user.id}});

        if (!found) {
            this.throwNotFound(id);
        }

        return found;
    }

    public async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    public async patchTask(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task: Task = await this.getTaskById(id, user);

        task.status = status;
        task.save();

        return task;
    }

    public async deleteTask(id: string, user: User): Promise<void> {
        const task: Task = await this.getTaskById(id, user);

        if (!task) {
            this.throwNotFound(id);
        }

        await task.remove();
    }

    private throwNotFound(id: string): never {
        throw new NotFoundException(`Task with id ${id} is not found.`);
    }
}
