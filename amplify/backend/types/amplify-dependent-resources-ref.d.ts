export type AmplifyDependentResourcesAttributes = {
    api: {
        tictactoe: {
            GraphQLAPIIdOutput: "string";
            GraphQLAPIEndpointOutput: "string";
        };
    };
    auth: {
        tictactoe0c8b3f75: {
            IdentityPoolId: "string";
            IdentityPoolName: "string";
            UserPoolId: "string";
            UserPoolArn: "string";
            UserPoolName: "string";
            AppClientIDWeb: "string";
            AppClientID: "string";
        };
    };
    function: {
        postConfirmation: {
            Name: "string";
            Arn: "string";
            Region: "string";
            LambdaExecutionRole: "string";
        };
        preAuth: {
            Name: "string";
            Arn: "string";
            Region: "string";
            LambdaExecutionRole: "string";
        };
        startGame: {
            Name: "string";
            Arn: "string";
            Region: "string";
            LambdaExecutionRole: "string";
        };
    };
};
