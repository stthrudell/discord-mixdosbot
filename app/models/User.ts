import { Model, DataTypes } from 'sequelize'
import { database } from '../database'
  
export interface UserInterface {
  id: number
  discordId: string
  steamId: string
}

class User extends Model {

  public id!: number
  public discordId!: string
  public steamId!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

}

// User.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     discordId: {
//       type: DataTypes.STRING,
//       allowNull: false,        
//     },
//     steamId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize: database, // passing the `sequelize` instance is required,
//     tableName: 'users',
//   }
// )

// User.sync({force: true}).then(() => {
//   return User.create({    
//     discordId: '1231a',
//     steamId: 'steam1',
//   });
// });

export default User
  