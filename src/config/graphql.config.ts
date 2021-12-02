import { Logger } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { GqlModuleOptions } from '@nestjs/graphql';

const graphqlConfig: GqlModuleOptions = {
  // playground: true,
  typePaths: [join(process.cwd(), 'src/**/*.graphql')],
  // sortSchema: true,
  debug: true,
  definitions: {
    path: join(process.cwd(), 'src/app/graphql/graphql.schema.ts'),
  },
  installSubscriptionHandlers: true,
  cors: {
    credentials: true,
    origin: true,
  },
  formatError: (error: GraphQLError): any => {
    new Logger('GraphQLError').error(error);
    return error.message;
  },
};

export default graphqlConfig;
