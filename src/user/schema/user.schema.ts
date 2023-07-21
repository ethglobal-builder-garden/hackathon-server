import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false, _id: false })
export class Social {
  @Prop({ required: false })
  discord: string;

  @Prop({ required: false })
  twitter: string;
}
export const SocialSchema = SchemaFactory.createForClass(Social);

@Schema({ versionKey: false, _id: false })
export class Pow {
  @Prop({ required: true })
  github: string;
}
export const PowSchema = SchemaFactory.createForClass(Pow);

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  nickName: string;

  @Prop({ required: true })
  walletAddress: string;

  @Prop({ required: false })
  tba: string;

  @Prop({ required: false })
  tokenId: number;

  @Prop({ required: true })
  userType: string;

  @Prop({ required: true })
  social: Social;

  @Prop({ required: true })
  pow: Pow;
}

export const UserSchema = SchemaFactory.createForClass(User);
