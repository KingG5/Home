import User from './User';
import Game from './Game';
import Question from './Question';
import Answer from './Answer';
import GamePlayer from './GamePlayer';

// Define associations
Game.hasMany(Question, { foreignKey: 'gameId', as: 'questions' });
Question.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

Game.hasMany(Answer, { foreignKey: 'gameId', as: 'answers' });
Answer.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

User.hasMany(Answer, { foreignKey: 'userId', as: 'answers' });
Answer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Game.hasMany(GamePlayer, { foreignKey: 'gameId', as: 'players' });
GamePlayer.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

User.hasMany(GamePlayer, { foreignKey: 'userId', as: 'games' });
GamePlayer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Game, Question, Answer, GamePlayer };
export { sequelize, connectDatabase } from './database';
