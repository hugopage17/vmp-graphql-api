import {
    AdminCreateUserCommand,
    CognitoIdentityProvider,
    ListUsersCommand,
    ListUsersCommandOutput,
    AdminUpdateUserAttributesCommand,
    AdminEnableUserCommand,
    AdminDisableUserCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { IUserDetails, ICreateUserPayload, IUpdateUserPayload } from "../../types";

export class CognitoService {
    private readonly client: CognitoIdentityProvider;
    private readonly userPoolId: string;
    constructor(userPoolId: string) {
        this.client = new CognitoIdentityProvider({ region: process.env.AWS_DEFAULT_REGION! });
        this.userPoolId = userPoolId;
    }

    public async listUsers() {
        let users: IUserDetails[] = [];
        let paginationToken: string | undefined = undefined;
    
        do {
            const response: ListUsersCommandOutput = await this.client.send(new ListUsersCommand({
                UserPoolId: this.userPoolId,
                PaginationToken: paginationToken,
            }));
            if (response?.Users) {
                const usersList: IUserDetails[] = response?.Users?.map((user) => ({
                    id: user.Attributes?.find((attr) => attr.Name === "sub")?.Value ?? "",
                    email: user.Attributes?.find((attr) => attr.Name === "email")?.Value ?? "",
                    firstName: user.Attributes?.find((attr) => attr.Name === "given_name")?.Value ?? "",
                    lastName: user.Attributes?.find((attr) => attr.Name === "family_name")?.Value ?? "",
                    role: user.Attributes?.find((attr) => attr.Name === "custom:role")?.Value ?? "",
                    createdAt: user.UserCreateDate!,
                    lastModified: user.UserLastModifiedDate!,
                    active: user?.Enabled!,
                    status: user?.UserStatus!
                }))
                users = users.concat(usersList);
            }
            paginationToken = response.PaginationToken;
        } while (paginationToken);
    
        return users;
    }

    public async createUser(payload: ICreateUserPayload) {
        try {
            const createUserCommand = await this.client.send(new AdminCreateUserCommand({
                UserPoolId: this.userPoolId,
                Username: payload.email,
                UserAttributes: [
                    {
                        Name: "email",
                        Value: payload.email
                    },
                    {
                        Name: "given_name",
                        Value: payload.firstName
                    },
                    {
                        Name: "family_name",
                        Value: payload.lastName
                    },
                    {
                        Name: "custom:role",
                        Value: payload.isAdmin ? "ADMIN" : "AGENT"
                    }
                ]
            }));
            console.info("Created new user", JSON.stringify(createUserCommand, null, 2));
            const user = createUserCommand.User;
            return {
                id: user?.Attributes?.find((attr) => attr.Name === "sub")?.Value ?? "",
                email: user?.Attributes?.find((attr) => attr.Name === "email")?.Value ?? "",
                firstName: user?.Attributes?.find((attr) => attr.Name === "given_name")?.Value ?? "",
                lastName: user?.Attributes?.find((attr) => attr.Name === "family_name")?.Value ?? "",
                role: user?.Attributes?.find((attr) => attr.Name === "custom:role")?.Value ?? "",
                createdAt: user?.UserCreateDate!,
                lastModified: user?.UserLastModifiedDate!,
                active: user?.Enabled!,
                status: user?.UserStatus!
            }
        } catch (error) {
            console.error("Failed to create new user", error);
            throw error
        }
    }

    public async editUser(payload: IUpdateUserPayload): Promise<void> {
        const userAttributes: any = [];
        const username = payload.email;
        if (payload.firstName !== undefined) {
          userAttributes.push({ Name: "given_name", Value: payload.firstName });
        }
    
        if (payload.lastName !== undefined) {
          userAttributes.push({ Name: "family_name", Value: payload.lastName });
        }
    
        if (payload.isAdmin !== undefined) {
          userAttributes.push({
            Name: "custom:role",
            Value: payload.isAdmin ? "ADMIN" : "AGENT",
          });
        }
    
        if (userAttributes.length > 0) {
          await this.client.send(
            new AdminUpdateUserAttributesCommand({
              UserPoolId: this.userPoolId,
              Username: username,
              UserAttributes: userAttributes,
            })
          );
        }
    
        if (payload.active !== undefined) {
          if (payload.active) {
            await this.client.send(
              new AdminEnableUserCommand({
                UserPoolId: this.userPoolId,
                Username: username,
              })
            );
          } else {
            await this.client.send(
              new AdminDisableUserCommand({
                UserPoolId: this.userPoolId,
                Username: username,
              })
            );
          }
        }
    }
}