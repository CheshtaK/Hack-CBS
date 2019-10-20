import { v4 } from 'uuid';

module.exports = (sequelize, DataTypes) => {
    const Answers = sequelize.define('Answers', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        post_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        answer_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: () => v4(),
        },
        answer_text: {
            type: DataTypes.TEXT,
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date().toISOString(),
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date().toISOString(),
        },
        text_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
        },
    });
    // eslint-disable-next-line
    Answers.associate = ({ User, Posts, Answers, Comments_Answers }) => {
        // eslint-disable-next-line no-param-reassign
        Answers.User = Answers.belongsTo(User, {
            onDelete: 'SET NULL',
            targetKey: 'email',
            foreignKey: 'id',
            constraints: true,
            onUpdate: 'CASCADE',
        });
        // eslint-disable-next-line no-param-reassign
        Answers.Posts = Answers.belongsTo(Posts, {
            onDelete: 'SET NULL',
            targetKey: 'post_id',
            foreignKey: 'post_id',
            constraints: true,
            onUpdate: 'CASCADE',
        });
        // eslint-disable-next-line no-param-reassign
        Answers.Comments_Answers = Answers.hasMany(Comments_Answers, {
            sourceKey: 'answer_id',
            foreignKey: 'answer_id',
            onDelete: 'SET NULL',
            constraints: true,
            onUpdate: 'CASCADE',
        });
    };

    return Answers;
};
