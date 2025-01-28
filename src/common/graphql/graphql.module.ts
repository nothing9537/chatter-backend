import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { Logger, Module, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (authService: AuthService) => ({
        autoSchemaFile: true,
        cors: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: (context) => {
              try {
                const request = (context.extra as any).request as Request;

                console.log(context.connectionParams);

                const user = authService.verifyWs(
                  request,
                  context.connectionParams,
                );

                (context as any).user = user;
              } catch (error) {
                new Logger().error(error);

                throw new UnauthorizedException('Unauthorized');
              }
            },
          },
        },
      }),
      imports: [AuthModule],
      inject: [AuthService],
    }),
  ],
  exports: [NestGraphQLModule],
})
export class GraphQLModule {}
