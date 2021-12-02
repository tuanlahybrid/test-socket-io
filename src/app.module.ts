import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './app/modules/chat/chat.module';
import graphqlConfig from './config/graphql.config';

@Module({
  imports: [GraphQLModule.forRoot(graphqlConfig), ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
