import { InjectModel } from '@nestjs/mongoose';
import { GlobalHttpService } from 'src/http/http.service';
import { ConfigService } from '@nestjs/config';
import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';

import builderVaultFactoryJson from 'src/contractABI/vault/BuilderVaultFactory.sol/BuilderVaultFactory.json';
import { Vault, VaultDocument } from './schema/vault.schema';

@Injectable()
export class VaultService implements OnModuleInit {
  private jsonRpcProvider;
  private alchemy;
  private vaultFactoryContract;
  private vaultCreatedEventTypes;
  constructor(
    @InjectModel(Vault.name) private readonly vaultModel: Model<VaultDocument>,
    private readonly httpService: GlobalHttpService,
    private readonly config: ConfigService,
  ) {
    this.alchemy = new Alchemy({
      apiKey: this.config.get('ALCHEMY_API_KEY'),
      network: Network.MATIC_MUMBAI,
    });

    this.jsonRpcProvider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.g.alchemy.com/v2/${this.config.get(
        'ALCHEMY_API_KEY',
      )}`,
    );

    this.vaultFactoryContract = new ethers.Contract(
      this.config.get('BUILDER_VAULT_FACTORY'),
      builderVaultFactoryJson.abi,
      this.jsonRpcProvider,
    );

    this.vaultCreatedEventTypes = builderVaultFactoryJson.abi
      .find((e) => e.name == 'VaultCreated')
      .inputs.map((eventParam) =>
        ethers.utils.ParamType.fromObject(eventParam),
      );
  }

  async onModuleInit() {
    const currentBlockNumber = await this.alchemy.core.getBlockNumber();

    const logs = await this.vaultFactoryContract.queryFilter(
      this.vaultFactoryContract.filters.VaultCreated(),
      0,
      currentBlockNumber,
    );
    await Promise.all(logs.map((log) => this.newVaultCreated(log)));

    await this.alchemy.ws.on(
      this.vaultFactoryContract.filters.VaultCreated(),
      async (log) => {
        await this.newVaultCreated(log);
      },
    );
    console.log('Event Service initiated');
  }

  async newVaultCreated(log) {
    console.log('New Vault Created');

    const eventData = ethers.utils.defaultAbiCoder.decode(
      this.vaultCreatedEventTypes,
      log.data,
    );

    const vaultDoc = await this.vaultModel.findOne({
      title: eventData.title,
    });
    vaultDoc.vaultContract = eventData.vault;
    vaultDoc.save();
  }

  async createVault(newVault: Vault) {
    const createdVault = new this.vaultModel(newVault);
    return createdVault.save();
  }
}
