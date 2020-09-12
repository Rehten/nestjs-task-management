import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform<string, string> {
    public readonly allowedStatuses: TaskStatus[] = Object.values(TaskStatus);

    transform(value: string, metadata: ArgumentMetadata): TaskStatus {
        value = value.toUpperCase();

        if (this.isStatusValid(value as TaskStatus)) {
            return value as TaskStatus;
        } else {
            throw new BadRequestException(`Status ${value} is not allowed.`);
        }
    }

    private isStatusValid(value: TaskStatus): boolean {
        return Boolean(this.allowedStatuses.find(status => status === value));
    }
}
