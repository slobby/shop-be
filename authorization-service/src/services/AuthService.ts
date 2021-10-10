import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda';

export class AuthService {
  constructor() {}

  getAuthorizerResult = (
    principalId: string,
    effect: string,
    resource: string,
  ): APIGatewayAuthorizerResult => ({
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  });

  getToken = (event: APIGatewayTokenAuthorizerEvent): string => {
    const { type, authorizationToken } = event;

    if (!type || type !== 'TOKEN') {
      throw new Error('Expected "event.type" parameter to have value "TOKEN"');
    }

    if (!authorizationToken) {
      throw new Error(
        'Expected "event.authorizationToken" parameter to be set',
      );
    }

    const match = authorizationToken.match(/^Basic (.*)$/);
    if (!match || match.length < 2) {
      throw new Error(
        `Invalid Authorization token - ${authorizationToken} does not match "Basic .*"`,
      );
    }
    return match[1];
  };

  authenticate = (event: APIGatewayTokenAuthorizerEvent) => {
    const token = this.getToken(event);
    const plainCreds = Buffer.from(token, 'base64')
      .toString('utf-8')
      .split(':');
    const user = plainCreds[0];
    const password = plainCreds[1];

    console.log(`Username: ${user}, password: ${password}`);

    // if (!user || !password) {
    //   throw new Error('invalid token');
    // }

    const storedPassword = process.env[user];

    const effect =
      storedPassword && storedPassword == password ? 'Allow' : 'Deny';
    return Promise.resolve(
      this.getAuthorizerResult(token, effect, event.methodArn),
    );
  };
}
