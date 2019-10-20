module.exports = (sequelize, DataTypes) => {
    // eslint-disable-next-line camelcase
    const Subtopic_Tag_Map = sequelize.define(
        'Subtopic_Tag_Map',
        {
            subtopic_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            tag_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            tableName: 'Subtopic_Tag_Map',
            timestamps: false,
            ignoreDuplicates: true,
        },
    );
    Subtopic_Tag_Map.associate = ({
        // eslint-disable-next-line
        Subtopic_Tag_Map,
        // eslint-disable-next-line camelcase
        Subtopic_IDS,
        // eslint-disable-next-line camelcase
        Tag_IDS,
    }) => {
        // eslint-disable-next-line no-param-reassign
        Subtopic_Tag_Map.Subtopic_IDS = Subtopic_Tag_Map.belongsTo(
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
        Subtopic_Tag_Map.Tag_IDS = Subtopic_Tag_Map.belongsTo(Tag_IDS, {
            foreignKey: 'tag_id',
            targetKey: 'id',
            onDelete: 'SET NULL',
            constraints: true,
            onUpdate: 'CASCADE',
        });
    };
    Subtopic_Tag_Map.removeAttribute('id');
    // eslint-disable-next-line camelcase
    return Subtopic_Tag_Map;
};
