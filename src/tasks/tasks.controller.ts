import { AppDataSource } from '../..';
import { Task } from './tasks.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UpdateResult } from 'typeorm';

class TasksController {
  //method for the get route
  public async getAll(req: Request, res: Response): Promise<Response> {
    let allTasks: Task[];

    try {
      allTasks = await AppDataSource.getRepository(Task).find({
        order: {
          date: 'ASC',
        },
      });
      allTasks = instanceToPlain(allTasks) as Task[];
      return res.status(200).json(allTasks);
    } catch (_errors) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  //method for the post route
  public async create(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //create a new instance of the Task
    const newTask = new Task();

    //add the required properties to the Task object
    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;

    //Add the new task to the database
    let createdTask: Task;

    try {
      createdTask = await AppDataSource.getRepository(Task).save(newTask);

      //conver the task instance to an object
      createdTask = instanceToPlain(createdTask) as Task;

      return res.status(200).json(createdTask);
    } catch (_error) {
      return res.status(500).json({ Error: 'Internal server error' });
    }
  }

  //Method for updating tasks
  public async update(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Try to find if the tasks exists
    let task: Task | null;

    try {
      task = await AppDataSource.getRepository(Task).findOne({
        where: {id: req.body.id},
      });
    } catch (_error) {
      return res.status(500).json({ Error: 'Internal server error' });
    }

    //return 400 if task is null
    if (!task) {
      return res
        .status(404)
        .json({ Error: 'The task with given ID does not exist' });
    }

    //declare a variable for updatedTask
    let updatedTask: UpdateResult;

    //update the task
    try {
      updatedTask = await AppDataSource.getRepository(Task).update(
        req.body.id,
        plainToInstance(Task, { status: req.body.status }),
      );

      //convert the updated task instance and return back to user
      updatedTask = instanceToPlain(updatedTask) as UpdateResult;

      return res.status(200).json(updatedTask);
    } catch (error) {
      return res.status(500).json({ Error: 'Internal server error' });
    }

  }
}

export const taskController = new TasksController();
