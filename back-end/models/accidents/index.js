module.exports = (sequelize, DataTypes) => {
    // eslint-disable-next-line camelcase
    const Comments_Posts = sequelize.define(
        'Comments_Posts',
        {
            post_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            comment_id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
        },
        {
            timestamps: false,
        },
    );

    // eslint-disable-next-line
    Comments_Posts.associate = ({ Comments_Posts, Comments_Info, Posts }) => {
        // eslint-disable-next-line no-param-reassign
        Comments_Posts.Comment_Info = Comments_Posts.hasOne(Comments_Info, {
            foreignKey: 'comment_id',
            onDelete: 'SET NULL',
            constraints: true,
            onUpdate: 'CASCADE',
        });
        // eslint-disable-next-line no-param-reassign
        Comments_Posts.Posts = Comments_Posts.belongsTo(Posts, {
            foreignKey: 'post_id',
            targetKey: 'post_id',
            onDelete: 'SET NULL',
            constraints: true,
            onUpdate: 'CASCADE',
        });
    };
    // eslint-disable-next-line camelcase
    return Comments_Posts;
};
