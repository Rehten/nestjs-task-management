import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { uuid } from 'uuidv4';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks = [];

    public getAllTasks(): Task[] {
        return this.tasks;
    }

    public getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
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
        const task: Task = this.tasks.find(task => task.id === id);

        task.status = status;

        return task;
    }

    public deleteTask(id: string): void {
        const index: number = this.tasks.indexOf(task => task.id === id);

        this.tasks.splice(index, 1);
    }
}
