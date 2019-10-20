module.exports = (sequelize, DataTypes) => {
    const Preference = sequelize.define(
        'Preference',
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            preference_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        },
    );
    // eslint-disable-next-line
    Preference.associate = ({ User, Preference, Preference_Names }) => {
        Preference.belongsTo(User, {
            targetKey: 'email',
            constraints: true,
            foreignKey: 'email',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });
        Preference.belongsTo(Preference_Names, {
            targetKey: 'preference_id',
            foreignKey: 'preference_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
            constraints: true,
        });
    };

    Preference.removeAttribute('id');

    return Preference;
};
