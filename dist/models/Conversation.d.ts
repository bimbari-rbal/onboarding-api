import mongoose, { Document, Types } from 'mongoose';
export interface IConversation extends Document {
    userId: Types.ObjectId;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Conversation: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, {}> & IConversation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Conversation.d.ts.map