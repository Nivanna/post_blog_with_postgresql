const Sequelize = require('sequelize');
const db = require('../config/db');
const User = require('../model/User');

const Post = db.define('Post', {
    title: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.TEXT,
    },
},
{
    //Rewrite default behavior of sequelize
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'posts'
});

Post.belongsTo(User);
User.hasMany(Post);

Post.sync().then(()=>{});

module.exports = Post;