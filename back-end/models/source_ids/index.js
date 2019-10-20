module.exports = (sequelize, DataTypes) => {
    // eslint-disable-next-line camelcase
    const Source_IDS = sequelize.define(
        'Source_IDS',
        {
            source_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            website_domain: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            freezeTableName: true,
            tableName: 'Source_IDS',
            timestamps: false,
            ignoreDuplicates: true,
        },
    );
    // eslint-disable-next-line camelcase
    return Source_IDS;
};
