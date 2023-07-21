import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type VaultDocument = Vault & Document;

@Schema({ versionKey: false })
export class Vault {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  builder: string;

  @Prop({ required: false })
  vaultContract: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true })
  deadline: number;

  @Prop({ required: true })
  hackathon: string;

  @Prop({ required: true })
  story: string;
}

export const VaultSchema = SchemaFactory.createForClass(Vault);
