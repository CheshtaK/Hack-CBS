module.exports = (sequelize, DataTypes) => {
    // eslint-disable-next-line camelcase
    const Source_Preference_Map = sequelize.define(
        'Source_Preference_Map',
        {
            preference_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            source_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            tableName: 'Source_Preference_Map',
            timestamps: false,
            ignoreDuplicates: true,
        },
    );
    Source_Preference_Map.associate = ({
        // eslint-disable-next-line
        Source_Preference_Map,
        // eslint-disable-next-line camelcase
        Source_IDS,
        // eslint-disable-next-line camelcase
        Preference_Names,
    }) => {
        // eslint-disable-next-line no-param-reassign
        Source_Preference_Map.Subtopic_IDS = Source_Preference_Map.belongsTo(
            Source_IDS,
            {
                foreignKey: 'source_id',
                onDelete: 'SET NULL',
                constraints: true,
                targetKey: 'source_id',
                onUpdate: 'CASCADE',
            },
        );
        // eslint-disable-next-line no-param-reassign
        Source_Preference_Map.Preference_Names = Source_Preference_Map.belongsTo(
            Preference_Names,
            {
                foreignKey: 'preference_id',
                targetKey: 'preference_id',
                onDelete: 'SET NULL',
                constraints: true,
                onUpdate: 'CASCADE',
            },
        );
    };
    Source_Preference_Map.removeAttribute('id');
    // eslint-disable-next-line camelcase
    return Source_Preference_Map;
};
