import {
  APIGatewayTokenAuthorizerEvent,
  Handler,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { AuthService } from '@services/AuthService';

const basicAuthorizer: Handler<
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult
> = async (event: APIGatewayTokenAuthorizerEvent) => {
  const authService = new AuthService();
  let response;
  try {
    response = await authService.authenticate(event);
  } catch (err) {
    console.log(err);
    return null;
  }
  return response;
};

export const main = middyfy(basicAuthorizer);
