module.exports = (sequelize, DataTypes) => {
    // eslint-disable-next-line camelcase
    const Source_Subtopic_Map = sequelize.define(
        'Source_Subtopic_Map',
        {
            subtopic_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            source_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        },
        {
            freezeTableName: true,
            tableName: 'Source_Subtopic_Map',
            timestamps: false,
            ignoreDuplicates: true,
        },
    );
    Source_Subtopic_Map.associate = ({
        // eslint-disable-next-line
        Source_Subtopic_Map,
        // eslint-disable-next-line camelcase
        Source_IDS,
        // eslint-disable-next-line camelcase
        Subtopic_IDS,
    }) => {
        // eslint-disable-next-line no-param-reassign
        Source_Subtopic_Map.Subtopic_IDS = Source_Subtopic_Map.belongsTo(
            Subtopic_IDS,
            {
                foreignKey: 'subtopic_id',
                onDelete: 'SET NULL',
                constraints: true,
                targetKey: 'id',
                onUpdate: 'CASCADE',
            },
        );
        // eslint-disable-next-line no-param-reassign
        Source_Subtopic_Map.Source_IDS = Source_Subtopic_Map.belongsTo(
            Source_IDS,
            {
                foreignKey: 'source_id',
                targetKey: 'source_id',
                onDelete: 'SET NULL',
                constraints: true,
                onUpdate: 'CASCADE',
            },
        );
    };
    // eslint-disable-next-line camelcase
    return Source_Subtopic_Map;
};
