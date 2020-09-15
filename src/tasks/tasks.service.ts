import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.status';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {
    }
    // public async getTasks(filterTaskDto: FilterTasksDto): Promise<Task[]> {}
    //
    // private getAllTasks(): Promise<Task[]> {}
    //
    public async getTaskById(id: string): Promise<Task> {
        const found: Task = await this.taskRepository.findOne(id);

        if (!found) {
            this.throwNotFound(id);
        }

        return found;
    }

    public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    public async patchTask(id: string, status: TaskStatus): Promise<Task> {
        const task: Task = await this.getTaskById(id);

        task.status = status;
        task.save();

        return task;
    }

    public async deleteTask(id: string): Promise<void> {
        const task: Task = await this.getTaskById(id);

        if (!task) {
            this.throwNotFound(id);
        }

        await task.remove();
    }

    private throwNotFound(id: string): never {
        throw new NotFoundException(`Task with id ${id} is not found.`);
    }
}
