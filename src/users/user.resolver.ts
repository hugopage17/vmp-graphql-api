import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CognitoAuthGuard } from "src/auth/cognito.guard";
import { UserDetails, UpdateUserResponse } from "./models/user.model";
import { CreateUserInput, UpdateUserInput } from "./dto/user.input";   
import { UserService } from "./user.service";
import { LogRequest } from "../common/logger.service";

@Resolver(() => UserDetails)
export class UserResolver {
    private userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    @Query(() => [UserDetails])
    @UseGuards(CognitoAuthGuard)
    @LogRequest()
    async listUsers(): Promise<UserDetails[]> {
        return await this.userService.listUsers();
    }

    @Mutation(() => UserDetails)
    @UseGuards(CognitoAuthGuard)
    @LogRequest()
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserDetails> {
        return await this.userService.createUser(createUserInput);
    }

    @Mutation(() => UpdateUserResponse)
    @UseGuards(CognitoAuthGuard)
    @LogRequest()
    async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<UpdateUserResponse> {
        return await this.userService.editUser(updateUserInput);
    }
}
