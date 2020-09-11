import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { uuid } from 'uuidv4';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksService {
    private tasks = [];

    public getTasks({ search, status }: FilterTasksDto): Task[] {
        return this.tasks.filter(task => (
            !status || task.status === status) && (new RegExp(search).test(task.description) || !search
            )
        );
    }

    public getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id);

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" is not found`);
        }

        return found;
    }

    public createTask({ title, description }: CreateTaskDto): Task {
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);

        return task;
    }

    public patchTask(id: string, status: TaskStatus): Task {
        const task: Task = this.getTaskById(id);

        task.status = status;

        return task;
    }

    public deleteTask(id: string): void {
        const found = this.getTaskById(id);
        const index: number = this.tasks.indexOf(task => task.id === found.id);

        this.tasks.splice(index, 1);
    }
}
