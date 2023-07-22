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
import builderVaultJson from 'src/contractABI/vault/BuilderVaultImpl.sol/BuilderVaultImpl.json';
import { Vault, VaultDocument } from './schema/vault.schema';
import { User, UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class VaultService implements OnModuleInit {
  private jsonRpcProvider;
  private alchemy;
  private vaultFactoryContract;
  private vaultCreatedEventTypes;
  private fundAddedEventTypes;
  constructor(
    @InjectModel(Vault.name) private readonly vaultModel: Model<VaultDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

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

    this.fundAddedEventTypes = builderVaultJson.abi
      .find((e) => e.name == 'Funded')
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

    console.log('ws open for new vaults creating');
    await this.alchemy.ws.on(
      this.vaultFactoryContract.filters.VaultCreated(),
      async (log) => {
        await this.newVaultCreated(log);
      },
    );

    const allVaults = await this.vaultModel.find().lean();
    for (let i = 0; i < allVaults.length; i++) {
      const vault = allVaults[i];
      if (vault.vaultContract != null) {
        const vaultContract = new ethers.Contract(
          vault.vaultContract,
          builderVaultJson.abi,
          this.jsonRpcProvider,
        );

        const logs = await vaultContract.queryFilter(
          vaultContract.filters.Funded(),
          0,
          currentBlockNumber,
        );
        for (let j = 0; j < logs.length; j++) {
          await this.newFundAdded(logs[j]);
        }

        console.log('opening ws for funded for each prev vault');
        await this.alchemy.ws.on(
          vaultContract.filters.Funded(),
          async (log) => {
            await this.newFundAdded(log);
          },
        );
      }
    }

    console.log('Vault Event Service initiated');
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

    if (vaultDoc == null) {
      console.log('no vault');
      return;
    }

    if (vaultDoc.vaultContract == eventData.vault) {
      console.log('already added');
      return;
    }

    vaultDoc.vaultContract = eventData.vault;

    const vaultContract = new ethers.Contract(
      eventData.vault,
      builderVaultJson.abi,
      this.jsonRpcProvider,
    );

    console.log("open ws for new vault's funded");
    await this.alchemy.ws.on(vaultContract.filters.Funded(), async (log) => {
      await this.newFundAdded(log);
    });
    vaultDoc.save();
  }

  async newFundAdded(log) {
    console.log('New Funding Added');
    const eventData = ethers.utils.defaultAbiCoder.decode(
      this.fundAddedEventTypes,
      log.data,
    );

    const vaultDoc = await this.vaultModel.findOne({
      vaultContract: eventData.vault,
    });
    const currentAmount = ethers.BigNumber.from(vaultDoc.currentAmount);
    vaultDoc.backers.push(eventData.backer);
    vaultDoc.currentAmount = currentAmount
      .add(ethers.BigNumber.from(eventData.amount))
      .toString();
    vaultDoc.save();
  }

  async createVault(newVault: Vault) {
    const createdVault = new this.vaultModel(newVault);
    return createdVault.save();
  }

  async getAllVaults() {
    const allVaults = await this.vaultModel.find().lean();
    for (let i = 0; i < allVaults.length; i++) {
      const vault = allVaults[i];
      const builderAddress = vault.builder;
      const builder = await this.userModel
        .findOne({
          walletAddress: builderAddress,
        })
        .lean();
      vault['builderInfo'] = builder;
    }
    return allVaults;
  }

  async getOneVault(id: string) {
    const vault = await this.vaultModel.findOne({ _id: id }).lean();
    const builderAddress = vault.builder;
    const builder = await this.userModel
      .findOne({
        walletAddress: builderAddress,
      })
      .lean();
    vault['builderInfo'] = builder;
    return vault;
  }
}
