import mongoose, { Document, Types } from 'mongoose';
export type MessageRole = 'user' | 'assistant' | 'system';
export interface IMessage extends Document {
    conversationId: Types.ObjectId;
    role: MessageRole;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Message.d.ts.map