import { Injectable } from '@nestjs/common';
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
