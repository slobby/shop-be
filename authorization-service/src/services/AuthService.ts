import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda';

interface IDecode {
  name: string;
  password: string;
}

declare const process: {
  env: {
    NAME: string;
    PASSWORD: string;
  };
};

export class AuthService {
  private name: string;
  private password: string;
  constructor() {
    this.name = process.env.NAME;
    this.password = process.env.PASSWORD;
  }

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

    const match = authorizationToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new Error(
        `Invalid Authorization token - ${authorizationToken} does not match "Bearer .*"`,
      );
    }
    return match[1];
  };

  authenticate = (event: APIGatewayTokenAuthorizerEvent) => {
    const token = this.getToken(event);
    const decoded = JSON.parse(
      Buffer.from(token, 'base64').toString('utf-8'),
    ) as IDecode;

    if (!decoded || !decoded.name || !decoded.password) {
      throw new Error('invalid token');
    }

    const effect =
      decoded.name == this.name && decoded.password == this.password
        ? 'Allow'
        : 'Deny';
    return Promise.resolve(
      this.getAuthorizerResult(token, effect, event.methodArn),
    );
  };
}
