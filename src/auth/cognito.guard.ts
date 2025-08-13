import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USERPOOL_ID!,
    tokenUse: 'id', // or 'access' if you want to use access tokens
    clientId: process.env.APP_CLIENT!, // audience
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!token) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    try {
      const payload = await this.verifier.verify(token);

      // attach the verified user to request for resolvers to use
      req.user = {
        email: payload.email,
        username: payload['cognito:username'],
        ...payload,
      };

      return true;
    } catch (err) {
      console.error('JWT verification failed', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
