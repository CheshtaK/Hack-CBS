import { v4 } from 'uuid';

module.exports = (sequelize, DataTypes) => {
    // eslint-disable-next-line camelcase
    const Comments_Info = sequelize.define(
        'Comments_Info',
        {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            comment_id: {
                type: DataTypes.STRING,
                defaultValue: () => v4(),
                primaryKey: true,
            },
            comment_text: {
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
        },
        {
            freezeTableName: true,
            tableName: 'Comments_Info',
        },
    );

    Comments_Info.associate = ({
        // eslint-disable-next-line
        Comments_Info,
        User,
        // eslint-disable-next-line camelcase
        Comments_Posts,
        // eslint-disable-next-line camelcase
        Comments_Answers,
    }) => {
        // eslint-disable-next-line no-param-reassign
        Comments_Info.User = Comments_Info.belongsTo(User, {
            onDelete: 'SET NULL',
            targetKey: 'email',
            foreignKey: 'id',
            constraints: 'true',
            onUpdate: 'CASCADE',
        });
        // eslint-disable-next-line no-param-reassign
        Comments_Info.Comments_Posts = Comments_Info.belongsTo(Comments_Posts, {
            onDelete: 'SET NULL',
            targetKey: 'comment_id',
            foreignKey: 'comment_id',
            constraints: 'true',
            onUpdate: 'CASCADE',
        });
        // eslint-disable-next-line no-param-reassign
        Comments_Info.Comments_Answers = Comments_Info.belongsTo(
            Comments_Answers,
            {
                onDelete: 'SET NULL',
                targetKey: 'comment_id',
                foreignKey: 'comment_id',
                constraints: 'true',
                onUpdate: 'CASCADE',
            },
        );
    };
    // eslint-disable-next-line camelcase
    return Comments_Info;
};
