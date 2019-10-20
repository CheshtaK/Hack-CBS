import { v4 } from 'uuid';

module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define('Posts', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        post_id: {
            primaryKey: true,
            type: DataTypes.STRING,
            defaultValue: () => v4(),
        },
        post_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        post_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        text_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
        },
        num_comments: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: new Date().toISOString(),
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: new Date().toISOString(),
            allowNull: false,
        },
        num_answers: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        category: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
        },
        viewed: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        last_activity: {
            type: DataTypes.DATE,
            defaultValue: new Date().toISOString(),
            allowNull: false,
        },
        num_upvotes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        num_downvotes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    });

    // eslint-disable-next-line no-shadow
    Posts.associate = ({ Posts, User, Answers }) => {
        // eslint-disable-next-line no-param-reassign
        Posts.User = Posts.belongsTo(User, {
            onDelete: 'SET NULL',
            targetKey: 'email',
            constraints: true,
            foreignKey: 'id',
            onUpdate: 'CASCADE',
        });
        // eslint-disable-next-line no-param-reassign
        Posts.Answers = Posts.hasMany(Answers, {
            sourceKey: 'post_id',
            foreignKey: 'post_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
    };

    return Posts;
};
