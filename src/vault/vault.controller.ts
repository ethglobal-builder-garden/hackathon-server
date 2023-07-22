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

  @Get('/all')
  async getAllVaults() {
    return this.vaultService.getAllVaults();
  }

  @Get('/one/:id')
  async getOneVault(@Param('id') id: string) {
    return this.vaultService.getOneVault(id);
  }
}
