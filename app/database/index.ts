require('dotenv/config')

const Sequelize = require('sequelize')

const dbConfig = {
    dialect: 'sqlite',
    storage: 'app/database/database.sqlite',
    define: {
        timestamp: true,
    },    
}

export const database = new Sequelize(dbConfig)

