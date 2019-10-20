import { v4 } from 'uuid';
import bcrypt from 'bcrypt-nodejs';
import logger from '../../helpers/logger';
// eslint-disable-next-line import/named
import { tokenMaker } from '../../helpers/token-util';
import { ForbiddenError } from '../../errors';

const cryptPassword = password =>
    new Promise((resolve, reject) => {
        // eslint-disable-next-line consistent-return
        bcrypt.genSalt(10, (err, salt) => {
            // Encrypt password using bcyrpt module
            if (err) return reject(err);
            // eslint-disable-next-line no-shadow
            bcrypt.hash(password, salt, null, (err, hash) => {
                if (err) return reject(err);
                return resolve(hash);
            });
        });
    });

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.STRING,
                defaultValue: () => v4(),
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dob: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            email: {
                primaryKey: true,
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_login: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            client: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            confirmed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            emailtoken: {
                type: DataTypes.TEXT,
            },
        },
        {
            hooks: {
                async beforeCreate(user) {
                    return cryptPassword(user.password)
                        .then(async success => {
                            // eslint-disable-next-line no-param-reassign
                            user.password = success;
                            // eslint-disable-next-line no-param-reassign
                            user.createdAt = new Date().toString();
                            const emailTokenData = user.dataValues;
                            emailTokenData.confirmationToken = true;
                            // eslint-disable-next-line no-param-reassign
                            user.emailtoken = await tokenMaker(emailTokenData);
                        })
                        .catch(err => err && logger.error(err));
                },
            },
        },
    );
    // eslint-disable-next-line
    User.associate = ({ User, Preferences, Answers, Posts }) => {
        // User.Preferences = User.hasMany(Preferences, {
        //     onDelete : 'SET NULL',
        //     constraints : true,
        //     sourceKey : 'email',
        //     foreignKey : 'email'
        // });
        // eslint-disable-next-line no-param-reassign
        User.Answers = User.hasMany(Answers, {
            onDelete: 'SET NULL',
            constraints: true,
            sourceKey: 'email',
            foreignKey: 'id',
        });
        // eslint-disable-next-line no-param-reassign
        User.Posts = User.hasMany(Posts, {
            onDelete: 'SET NULL',
            constraints: true,
            sourceKey: 'email',
            foreignKey: 'id',
        });
    };

    User.checkPassword = async ({ email, username }, password) => {
        let user = null;
        if (email) {
            user = await User.findOne({ where: { email } });
        } else {
            user = await User.findOne({ where: { username } });
        }
        if (!user) return { user: null, validLogin: false };
        let validLogin = false;
        await user
            .checkPassword(password)
            .then(res => {
                validLogin = !!res;
            })
            .catch(async err => {
                logger.error(err);
                validLogin = false;
            });
        return { user, validLogin };
    };

    User.prototype.checkPassword = function(password) {
        return new Promise((res, rej) =>
            bcrypt.compare(password, this.password, (err, resp) => {
                if (err) return rej(err);
                return res(resp);
            }),
        );
    };

    User.prototype.updatePassword = async function(password) {
        let newPassword = null;
        let userObj = null;
        await cryptPassword(password)
            .then(success => {
                newPassword = success;
            })
            .catch(err => {
                logger.error(err);
                throw new ForbiddenError(err.message);
            });
        await this.updateAttributes({
            password: newPassword,
        })
            .then(user => {
                userObj = user;
            })
            .catch(err => {
                throw new ForbiddenError(err.message);
            });
        return userObj;
    };

    return User;
};
