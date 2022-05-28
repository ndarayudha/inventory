import { CfnOutput, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { InventoryStack } from "./inventory-stack";

export class PipelineStage extends Stage {
  public readonly urlOutput: CfnOutput;
    
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new InventoryStack(this, 'WebService');
    
    // Expose CdkpipelinesDemoStack's output one level higher
    this.urlOutput = service.urlOutput;
  }
}
