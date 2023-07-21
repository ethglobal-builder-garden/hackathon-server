import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GlobalHttpService } from './http.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [GlobalHttpService],
  exports: [GlobalHttpService],
})
export class GlobalHttpModule {}
