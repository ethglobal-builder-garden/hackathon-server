import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
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

import builderGardenJson from 'src/contractABI/BuilderGarden.sol/BuilderGarden.json';

@Injectable()
export class UserService implements OnModuleInit {
  private jsonRpcProvider;
  private alchemy;
  private builderGardenContract;
  private signUpEventTypes;
  constructor(
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

    this.builderGardenContract = new ethers.Contract(
      this.config.get('BUILDER_GARDEN_CONTRACT'),
      builderGardenJson.abi,
      this.jsonRpcProvider,
    );

    this.signUpEventTypes = builderGardenJson.abi
      .find((e) => e.name == 'SignUp')
      .inputs.map((eventParam) =>
        ethers.utils.ParamType.fromObject(eventParam),
      );
  }

  async onModuleInit() {
    const currentBlockNumber = await this.alchemy.core.getBlockNumber();

    const logs = await this.builderGardenContract.queryFilter(
      this.builderGardenContract.filters.SignUp(),
      0,
      currentBlockNumber,
    );

    await Promise.all(logs.map((log) => this.newUserSignUp(log)));

    console.log('BuilderGarden Signing ws opening');
    await this.alchemy.ws.on(
      this.builderGardenContract.filters.SignUp(),
      async (log) => {
        await this.newUserSignUp(log);
      },
    );
    console.log('User Event Service initiated');
  }

  async newUserSignUp(log) {
    console.log('New User Signed Up');
    const eventData = ethers.utils.defaultAbiCoder.decode(
      this.signUpEventTypes,
      log.data,
    );

    const userDoc = await this.userModel.findOne({
      nickName: eventData.nickName,
    });
    userDoc.tba = eventData.tba;
    userDoc.tokenId = eventData.tokenId;

    userDoc.save();
  }

  async createUser(newUser: User) {
    const user = await this.userModel.create(newUser);
    return user;
  }

  async getUserByWalletAddress(walletAddress: string) {
    const user = await this.userModel.findOne({ walletAddress }).lean();
    return user;
  }
}
