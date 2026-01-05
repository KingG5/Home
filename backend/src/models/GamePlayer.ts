import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';
import { GamePlayer as IGamePlayer } from '../types';

interface GamePlayerCreationAttributes extends Optional<IGamePlayer, 'id' | 'score' | 'joinedAt'> {}

class GamePlayer extends Model<IGamePlayer, GamePlayerCreationAttributes> implements IGamePlayer {
  public id!: string;
  public gameId!: string;
  public userId!: string;
  public score!: number;
  public readonly joinedAt!: Date;
}

GamePlayer.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'game_players',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['gameId', 'userId'],
      },
    ],
  }
);

export default GamePlayer;
