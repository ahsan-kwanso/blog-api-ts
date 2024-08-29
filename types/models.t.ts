import { Model } from 'sequelize/types';
import User from '../sequelize/models/user.model.ts'

export interface PostInstance extends Model {
  id: number;
  title: string;
  content: string;
  UserId: number;
  updatedAt: Date;
  User?: typeof User; // Use the UserInstance type if you have it
}
