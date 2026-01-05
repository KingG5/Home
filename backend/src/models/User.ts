import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';
import { User as IUser } from '../types';

interface UserCreationAttributes extends Optional<IUser, 'id' | 'createdAt' | 'email' | 'passwordHash'> {}

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: string;
  public username!: string;
  public email?: string;
  public passwordHash?: string;
  public readonly createdAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

export default User;
