import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';
import { Question as IQuestion } from '../types';

interface QuestionCreationAttributes extends Optional<IQuestion, 'id' | 'createdAt' | 'albumName' | 'spotifyTrackId' | 'duration' | 'order'> {}

class Question extends Model<IQuestion, QuestionCreationAttributes> implements IQuestion {
  public id!: string;
  public gameId!: string;
  public trackName!: string;
  public artistName!: string;
  public albumName?: string;
  public correctAnswer!: string;
  public options!: string[];
  public spotifyTrackId?: string;
  public duration!: number;
  public readonly createdAt!: Date;
  public order!: number;
}

Question.init(
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
    trackName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artistName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    albumName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    spotifyTrackId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'questions',
    timestamps: false,
  }
);

export default Question;
