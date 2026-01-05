import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';
import { Game as IGame } from '../types';

interface GameCreationAttributes extends Optional<IGame, 'id' | 'code' | 'status' | 'createdAt' | 'currentQuestionId' | 'startedAt' | 'finishedAt'> {}

class Game extends Model<IGame, GameCreationAttributes> implements IGame {
  public id!: string;
  public name!: string;
  public code!: string;
  public status!: 'waiting' | 'active' | 'paused' | 'finished';
  public currentQuestionId?: string;
  public answerTimeLimit!: number;
  public createdBy!: string;
  public readonly createdAt!: Date;
  public startedAt?: Date;
  public finishedAt?: Date;
}

Game.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('waiting', 'active', 'paused', 'finished'),
      defaultValue: 'waiting',
      allowNull: false,
    },
    currentQuestionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    answerTimeLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'games',
    timestamps: false,
  }
);

export default Game;
