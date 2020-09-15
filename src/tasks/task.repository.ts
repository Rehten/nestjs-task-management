import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.status';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    public async createTask({ title, description }: CreateTaskDto): Promise<Task> {
        const task: Task = new Task();

        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;

        await task.save();

        return task;
    }
}
