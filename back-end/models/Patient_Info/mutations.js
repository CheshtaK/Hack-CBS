import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
} from 'graphql';
import AnswerType from '../patient_info/type';
import logger from '../../helpers/logger';
import {
    ForbiddenError,
    ValidationError,
    UnauthorizedError,
} from '../../errors';

import redisClient from '../../helpers/redis-helper';

const AnswerInputType = new GraphQLInputObjectType({
    name: 'AnswerInputType',
    fields: {
        id: {
            type: GraphQLString,
            description: 'The id of the user who has made the answer',
        },
        answer_text: {
            type: new GraphQLNonNull(GraphQLString),
            description:
                'The text written in the answer inclusive of the format chosen by the user',
        },
        answer_media: {
            type: new GraphQLList(GraphQLString),
            description: 'AWS Links of the media contained in the answer',
        },
        text_type: {
            type: GraphQLInt,
            description: 'The formatting used by the client to make the answer',
        },
        post_id: {
            type: GraphQLString,
            description: 'The id of the post to which the answer has been made',
        },
    },
});

const AnswerMutation = ({ Answers }) => ({
    addAnswer: {
        type: AnswerType,
        args: {
            answer: {
                type: new GraphQLNonNull(AnswerInputType),
                description: 'The answer to be added',
            },
        },
        // eslint-disable-next-line no-unused-vars
        resolve: async (root, { answer }, context, info) => {
            if (!answer.post_id && root.post_id) {
                // eslint-disable-next-line no-param-reassign
                answer.post_id = root.post_id;
            }
            if (!answer.id && root.email) {
                // eslint-disable-next-line no-param-reassign
                answer.id = root.email;
            }
            if (!answer.id || !answer.post_id) {
                throw new ValidationError([
                    {
                        key: 'IFE003',
                        message:
                            'Insufficient arguments, id and post_id must be present',
                    },
                ]);
            }
            const { user } = context;
            if (!user || user.email !== answer.id) {
                throw new UnauthorizedError();
            }
            await redisClient
                .selectAsync(process.env.USER_REDIS)
                .then(async selected => {
                    if (selected) {
                        await redisClient.delAsync(
                            answer.id + process.env.ANSWER_IDENTIFIER,
                        );
                    }
                })
                .catch(err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });
            let answerObj = {};
            await Answers.create(answer)
                .then(newAnswer => {
                    if (newAnswer) {
                        answerObj = newAnswer.dataValues;
                    } else {
                        throw new ValidationError([
                            {
                                key: 'IFE002',
                                message: 'Invalid Input',
                            },
                        ]);
                    }
                })
                .catch(err => {
                    logger.error(err);
                    throw new ForbiddenError();
                });
            return answerObj;
        },
    },
});

module.exports = AnswerMutation;
