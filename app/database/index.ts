require('dotenv/config')

// const Sequelize = require('sequelize')

// const dbConfig = {
//     dialect: 'sqlite',
//     storage: 'app/database/database.sqlite',
//     define: {
//         timestamp: true,
//     },    
// }

// export const database = new Sequelize(dbConfig)

import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_DB_URI || '')

export const database = mongoose;