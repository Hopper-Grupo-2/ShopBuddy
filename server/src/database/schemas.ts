import mongoose, { Schema } from "mongoose";
import IList from "../interfaces/list";
import IUser from "../interfaces/user";
import IMessage from "../interfaces/message";
import INotification, { NotificationTypes } from "../interfaces/notification";
import IProduct from "../interfaces/product";

export default class Schemas {
  private _productSchema: mongoose.Schema<IProduct>;
  private _listSchema: mongoose.Schema<IList>;
  private _userSchema: mongoose.Schema<IUser>;
  private _messageSchema: mongoose.Schema<IMessage>;
  private _notificationSchema: mongoose.Schema<INotification>;

  constructor() {
    this._productSchema = this.setProductSchema();
    this._listSchema = this.setListSchema();
    this._userSchema = this.setUserSchema();
    this._messageSchema = this.setMessageSchema();
    this._notificationSchema = this.setNotificationSchema();
  }

  private setProductSchema(): mongoose.Schema<IProduct> {
    return new mongoose.Schema<IProduct>({
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
      price: { type: Number, required: false },
      market: { type: String, required: false },
      checked: { type: Boolean, default: true },
    });
  }

  private setListSchema(): mongoose.Schema<IList> {
    return new mongoose.Schema<IList>({
      listName: { type: String, required: true },
      products: [this._productSchema],
      owner: { type: Schema.Types.ObjectId, required: true },
      members: [{ userId: { type: Schema.Types.ObjectId } }],
      createdAt: { type: Date, default: Date.now() },
      updatedAt: { type: Date, default: Date.now() },
    });
  }

  private setUserSchema(): mongoose.Schema<IUser> {
    return new mongoose.Schema<IUser>({
      username: { type: String, unique: true, required: true },
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      createdAt: { type: Date, required: true },
      updatedAt: { type: Date, required: true },
    });
  }

  private setMessageSchema(): mongoose.Schema<IMessage> {
    return new mongoose.Schema<IMessage>({
      listId: { type: Schema.Types.ObjectId, required: true },
      userId: { type: Schema.Types.ObjectId, required: true },
      textContent: { type: String, required: true },
      createdAt: { type: Date, default: Date.now() },
    });
  }

  private setNotificationSchema(): mongoose.Schema<INotification> {
    return new mongoose.Schema<INotification>({
      userId: { type: Schema.Types.ObjectId, required: true },
      listId: { type: Schema.Types.ObjectId, required: false },
      senderId: { type: Schema.Types.ObjectId, required: true },
      type: {
        type: String,
        enum: Object.values(NotificationTypes),
        required: true,
      },
      textContent: { type: String, required: true },
      read: { type: Boolean, required: true },
      createdAt: { type: Date, default: Date.now() },
      updatedAt: { type: Date, default: Date.now() },
    });
  }

  public get productSchema() {
    return this._productSchema;
  }

  public get listSchema() {
    return this._listSchema;
  }

  public get userSchema() {
    return this._userSchema;
  }

  public get messageSchema() {
    return this._messageSchema;
  }

  public get notificationSchema() {
    return this._notificationSchema;
  }
}
