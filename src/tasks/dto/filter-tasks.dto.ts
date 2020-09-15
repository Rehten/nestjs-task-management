import { TaskStatus } from '../task.status';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class FilterTasksDto {
    @IsOptional()
    @IsIn(Object.values(TaskStatus))
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}
