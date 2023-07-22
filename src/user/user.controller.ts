import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/one/:address')
  async getUser(@Param('address') walletAddress: string) {
    return this.userService.getUserByWalletAddress(walletAddress);
  }

  @Post('')
  async createUser(@Body() newUser: User) {
    return this.userService.createUser(newUser);
  }

  @Get('/airstack/:address')
  async getAirstackData(@Param('address') walletAddress: string) {
    return this.userService.getAirstackData(walletAddress);
  }
}
