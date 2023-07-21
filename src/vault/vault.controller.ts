import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VaultService } from './vault.service';
import { Vault } from './schema/vault.schema';

@Controller('vault')
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Post('')
  async createUser(@Body() newVault: Vault) {
    return this.vaultService.createVault(newVault);
  }
}
