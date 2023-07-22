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
  role: string;

  @Prop({ required: true })
  interest: string[];

  @Prop({ required: true })
  userType: string;

  @Prop({ required: true })
  social: Social;

  @Prop({ required: false })
  pow: Pow;

  @Prop({ required: false })
  pubkey: string;

  @Prop({ required: false })
  privkey: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
