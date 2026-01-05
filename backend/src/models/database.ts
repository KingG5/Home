import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'sqlite:./database.sqlite';

export const sequelize = new Sequelize(databaseUrl, {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialect: databaseUrl.startsWith('sqlite:') ? 'sqlite' : 'postgres',
  storage: databaseUrl.startsWith('sqlite:') ? databaseUrl.replace('sqlite:', '') : undefined,
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync models in development
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized.');
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;
