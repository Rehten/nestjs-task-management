import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatus } from './task.status';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 12, username: 'Test User' };

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    deleteTask: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TaskRepository,
                    useFactory: mockTaskRepository,
                }
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('some value');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();

            const filters: FilterTasksDto = { status: TaskStatus.OPEN, search: 'Abibas' };
            // call tasksService.getTasks
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('some value');

        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and succesfully retrieve and return the task', async () => {
            const mockTask = { title: 'Some title', description: 'My Description' };

            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);

            expect(result).toEqual(mockTask);
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id,
                },
            });
        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);

            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('calls taskRepository.createTask() and returns the result', async () => {
            taskRepository.createTask.mockResolvedValue('someTask');

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTaskDto = { title: 'Task test', description: 'test desc' };
            const result = await tasksService.createTask(createTaskDto, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
            expect(result).toEqual('someTask');
        })
    });

    describe('deleteTask', () => {
        it('calls taskRepository.deleteTask() to delete a task', async () => {
            const spy = jest.fn();
            taskRepository.findOne.mockResolvedValue({ id: 1, userId: mockUser.id, remove: spy });

            await tasksService.deleteTask(1, mockUser);
            expect(spy).toHaveBeenCalled();
        });

        it('throws an error if task could not be found', async () => {
            taskRepository.deleteTask.mockResolvedValue({ affected: 0 });

            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        })
    });
});
