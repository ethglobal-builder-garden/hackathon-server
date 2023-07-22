import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vault, VaultSchema } from './schema/vault.schema';
import { VaultService } from './vault.service';
import { VaultController } from './vault.controller';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vault.name, schema: VaultSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [VaultController],
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {}
