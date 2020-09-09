import { TaskStatus } from '../task.model';

export interface FilterTasksDto {
    status: TaskStatus;
    search: string;
}
