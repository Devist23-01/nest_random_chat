import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(): any {
    const DEBUG = process.env.MODE === 'DEV' ? true : false;
    mongoose.set('debug', DEBUG);
  }
}
