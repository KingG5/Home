import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';
import { Answer as IAnswer } from '../types';

interface AnswerCreationAttributes extends Optional<IAnswer, 'id' | 'answeredAt'> {}

class Answer extends Model<IAnswer, AnswerCreationAttributes> implements IAnswer {
  public id!: string;
  public gameId!: string;
  public questionId!: string;
  public userId!: string;
  public answer!: string;
  public isCorrect!: boolean;
  public readonly answeredAt!: Date;
  public timeToAnswer!: number;
  public pointsAwarded!: number;
}

Answer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'games',
        key: 'id',
      },
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    answeredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    timeToAnswer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pointsAwarded: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'answers',
    timestamps: false,
  }
);

export default Answer;
