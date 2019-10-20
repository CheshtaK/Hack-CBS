module.exports = (sequelize, DataTypes) => {
    // eslint-disable-next-line camelcase
    const Comments_Answers = sequelize.define(
        'Comments_Answers',
        {
            answer_id: {
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

    Comments_Answers.associate = ({
        // eslint-disable-next-line
        Comments_Answers,
        // eslint-disable-next-line camelcase
        Comments_Info,
        Answers,
    }) => {
        // eslint-disable-next-line no-param-reassign
        Comments_Answers.Comment_Info = Comments_Answers.hasOne(Comments_Info, {
            foreignKey: 'comment_id',
            onDelete: 'SET NULL',
            constraints: true,
            onUpdate: 'CASCADE',
        });
        // eslint-disable-next-line no-param-reassign
        Comments_Answers.Answers = Comments_Answers.belongsTo(Answers, {
            foreignKey: 'answer_id',
            targetKey: 'answer_id',
            onDelete: 'SET NULL',
            constraints: true,
            onUpdate: 'UPDATE',
        });
    };

    // eslint-disable-next-line camelcase
    return Comments_Answers;
};
