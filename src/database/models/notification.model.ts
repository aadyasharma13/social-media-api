import { Document, Model, model, Schema } from 'mongoose';
import { INotification } from '../../interfaces/notification-interface';

export default interface INotificationModel extends INotification, Document {
}

const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: Schema.Types.String,
    enum: ['follow', 'like', 'comment'],
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  isRead: {
    type: Schema.Types.Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We manually handle createdAt
});

// Index for efficient queries
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, createdAt: -1 });

export const Notification: Model<INotificationModel> = model<INotificationModel>('Notification', NotificationSchema);

