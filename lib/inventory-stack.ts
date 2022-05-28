import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib'
import { Runtime, Function, Code, Architecture } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';


export class InventoryStack extends Stack {
    public readonly urlOutput: CfnOutput;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // The Lambda function that contains the functionality
        const handler = new Function(this, 'Lambda', {
            runtime: Runtime.NODEJS_16_X,
            handler: 'handler.handler',
            architecture: Architecture.ARM_64,
            timeout: Duration.seconds(3),
            code: Code.fromAsset(path.resolve(__dirname, 'lambdas')),
        });

        // An API Gateway to make the Lambda web-accessible
        const gw = new LambdaRestApi(this, 'Gateway', {
            description: 'Endpoint for a simple Lambda-powered web service',
            handler,
        });

        this.urlOutput = new CfnOutput(this, 'Url', {
            value: gw.url,
        });
    }
}