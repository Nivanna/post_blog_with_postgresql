const Sequelize = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
    user_name : {
        type: Sequelize.STRING
    },
    user_email: {
        type: Sequelize.STRING
    },
    user_password: {
        type: Sequelize.STRING
    }
},

{
    //Rewrite default behavior of sequelize
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'users'
})

User.sync().then(() => {});

module.exports = User;