import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { CognitoService } from "../services/aws/cognito.service";
import { ICreateUserPayload, IUpdateUserPayload } from "src/types";

dayjs.extend(utc);

export class UserService {
    private readonly cognitoService: CognitoService;

    constructor() {
        this.cognitoService = new CognitoService(process.env.USERPOOL_ID!); 
    }

    public async listUsers() {
        const users = await this.cognitoService.listUsers();
        return users;
    };

    public async createUser(newUserPayload: ICreateUserPayload) {
        try {
            //const claims = event.requestContext.authorizer?.claims;
            // if (claims["custom:role"] !== "ADMIN") {
            //     return Response.forbidden();
            // }
            const newUser = await this.cognitoService.createUser(newUserPayload);
            return newUser;
        } catch (error) {
            console.error("Failed to create new user", error);
            throw error;
        }
    }

    public async editUser(editUserPayload: IUpdateUserPayload) {
        try {
            // const claims = event.requestContext.authorizer?.claims;
            // if (claims["custom:role"] !== "ADMIN") {
            //     return Response.forbidden();
            // }
            await this.cognitoService.editUser(editUserPayload);
            return {
                success: true
            }
        } catch (error) {
            console.error("Failed to edit user", error);
            throw error;
        }
    }
};
