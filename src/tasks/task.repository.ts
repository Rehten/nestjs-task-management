import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.status';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    public async getTasks(
        { search, status }: FilterTasksDto,
        user: User,
    ): Promise<Task[]> {
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search });
        }

        const tasks: Task[] = await query.getMany();

        return tasks;
    }

    public async createTask(
        { title, description }: CreateTaskDto,
        user: User,
    ): Promise<Task> {
        const task: Task = new Task();

        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        await task.save();

        delete task.user;

        return task;
    }
}
