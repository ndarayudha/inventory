import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import { InventoryStack } from './inventory-stack'
import * as codebuild from 'aws-cdk-lib/aws-codebuild';


export class InventoryPipeline extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // const inventoryStack = new InventoryStack(this, 'InventoryStack');

        // source
        const cdkSourceOutput = new codepipeline.Artifact();
        const cdkSourceAction = new codepipeline_actions.GitHubSourceAction({
            actionName: 'Github_Source',
            owner: 'yofan2408',
            repo: 'inventory',
            oauthToken: SecretValue.secretsManager('github-token-two'),
            output: cdkSourceOutput,
            branch: 'main'
        })


        // Build
        const pipelineProject = new codebuild.PipelineProject(this, 'InventoryProject');
        const cdkBuildOutput = new codepipeline.Artifact();
        const cdkBuildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'CDK_BUILD',
            project: pipelineProject,
            input: cdkSourceOutput,
            outputs: [cdkBuildOutput],
        })

        new codepipeline.Pipeline(this, 'InventoryPipeline', {
            stages: [
                {
                    stageName: 'Source',
                    actions: [cdkSourceAction]
                },
                {
                    stageName: 'Build',
                    actions: [cdkBuildAction]
                }
            ]
        });


        // const sourceArtifact = new Artifact();
        // const cloudAssemblyArtifact = new Artifact();

        // const pipeline = new CodePipeline(this, 'Pipeline', {
        //     // The pipeline name
        //     pipelineName: 'InventoryPipeline',
        //     cloudAssemblyArtifact,

        //     // Where the source can be found
        //     sourceAction: new GitHubSourceAction({
        //         actionName: 'GitHub',
        //         output: sourceArtifact,
        //         oauthToken: SecretValue.secretsManager('github-token-two'),
        //         owner: 'yofan2408',
        //         repo: 'inventory',
        //         branch: 'main'
        //     }),

        //     // How it will be built and synthesized
        //     synthAction: SimpleSynthAction.standardNpmSynth({
        //         sourceArtifact,
        //         cloudAssemblyArtifact,

        //         // We need a build step to compile the TypeScript Lambda
        //         buildCommand: 'npm run build'
        //     }),
        // });
        // // This is where we add the application stages
        // const preprod = new PipelineStage(this, 'PreProd', {
        //     env: { account: 'ACCOUNT-NUMBER', region: 'REGION' }
        // });

        // // put validations for the stages 
        // const preprodStage = pipeline.addStage(preprod);

        // preprodStage.addPre(new ShellScriptAction({
        //     actionName: 'TestService',
        //     useOutputs: {
        //         // Get the stack Output from the Stage and make it available in
        //         // the shell script as $ENDPOINT_URL.
        //         ENDPOINT_URL: pipeline.stackOutput(preprod.urlOutput),
        //     },
        //     commands: [
        //         // Use 'curl' to GET the given URL and fail if it returns an error
        //         'curl -Ssf $ENDPOINT_URL',
        //     ],
        // }));

        // pipeline.addStage(new PipelineStage(this, 'Prod', {
        //     env: { account: '925022112052', region: 'ap-southeast-1' }
        // }));
    }
}
