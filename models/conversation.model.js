import { Schema, model } from "mongoose";

const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    message: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }]
}, {timestamps: true});

export const Conversation = model('Conversation', conversationSchema);