import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.status';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    public async getTasks({ search, status }: FilterTasksDto): Promise<Task[]> {
        const query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search });
        }

        const tasks: Task[] = await query.getMany();

        return tasks;
    }

    public async createTask({ title, description }: CreateTaskDto): Promise<Task> {
        const task: Task = new Task();

        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;

        await task.save();

        return task;
    }
}
