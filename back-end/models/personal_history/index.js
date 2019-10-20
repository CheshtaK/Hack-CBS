import shortenURL from '../../helpers/url-shortener';
import logger from '../../helpers/logger';

// eslint-disable-next-line camelcase
const shorten = async post_url =>
    new Promise((resolve, reject) => {
        shortenURL(post_url)
            .then(shortenedURL => {
                // eslint-disable-next-line no-param-reassign
                resolve(shortenedURL);
            })
            .catch(err => {
                logger.error(err);
                reject(err);
            });
    });

module.exports = (sequelize, DataTypes) => {
    const FetchedPosts = sequelize.define(
        'Fetched_Posts',
        {
            post_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            source_website: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            post_url: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: -1,
            },
            subtopic_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: -1,
            },
            region_code: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
            tags: {
                type: DataTypes.ARRAY(DataTypes.INTEGER),
                allowNull: false,
            },
            num_comments: {
                type: DataTypes.INTEGER,
                defaultValue: -1,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
            },
            num_answers: {
                type: DataTypes.INTEGER,
                defaultValue: -1,
                allowNull: false,
            },
            viewed: {
                type: DataTypes.INTEGER,
                defaultValue: -1,
            },
            last_activity: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
            },
            post_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            excerpt: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            author_info: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: null,
            },
            accepted_answer_id: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
        },
        {
            freezeTableName: true,
            tableName: 'Fetched_Posts',
            timestamps: false,
            hooks: {
                afterBulkCreate: async posts => {
                    // eslint-disable-next-line camelcase
                    const { Fetched_Posts } = sequelize.models;
                    for (let i = 0; i < posts.length; i += 1) {
                        // eslint-disable-next-line no-await-in-loop
                        await shorten(posts[i].post_url)
                            .then(shortenedURL => {
                                if (shortenedURL) {
                                    Fetched_Posts.update(
                                        { post_url: shortenedURL },
                                        {
                                            where: {
                                                post_url: posts[i].post_url,
                                            },
                                        },
                                    ).catch(err => logger.error(err));
                                }
                            })
                            .catch(err => err && logger.error(err));
                    }
                },
            },
        },
    );

    return FetchedPosts;
};
