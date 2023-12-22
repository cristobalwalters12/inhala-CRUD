import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ApikeyMiddleware } from './commons/middleware/apikey.middleware';
import { LoggerMiddleware } from './commons/middleware/logger.middleware';
import { TraceMiddleware } from './commons/middleware/trace.middleware';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonasModule } from './modules/personas/personas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
        `${process.cwd()}/src/config/env/.env`,
      ],
      expandVariables: true,
      load: [appConfig],
    }),
    {
      ...HttpModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          timeout: configService.get('AXIOS_HTTP_TIMEOUT'),
        }),
        inject: [ConfigService],
      }),
      global: true,
    },
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: 'personas',
      }),
      inject: [ConfigService],
    }),
    PersonasModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TraceMiddleware, LoggerMiddleware)
      .forRoutes({ path: '/**', method: RequestMethod.ALL });
    consumer
      .apply(ApikeyMiddleware)
      .forRoutes({ path: '/**', method: RequestMethod.ALL });
  }
}
