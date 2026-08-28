import * as ecr from 'aws-cdk-lib/aws-ecr';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { GithubEcrPipeline } from './constructs/github-ecr-pipeline/github-ecr-construct';
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as s3 from "aws-cdk-lib/aws-s3";

export interface PipelineStackProps extends StackProps {
  branchName: string;
}

export class EVMSocketClientPipelineStack extends Stack {
  constructor(scope: App, id: string, props?: PipelineStackProps) {
    super(scope, id, props);

    const {branchName} = props!;

    const repository = new ecr.Repository(this, 'Repository', {
      repositoryName: 'services/evm-websocket-collector'
    });

    const bucketArn = ssm.StringParameter.fromStringParameterName(this, 'BucketName', `shared-resources-bucket-arn`).stringValue;
    const artifactBucket = s3.Bucket.fromBucketArn(this, 'ArtifactsBucket', bucketArn);

    new GithubEcrPipeline(this, 'SourcePipeline', {
      ecrRepository: repository,
      owner: 'eulertools',
      githubRepo: 'evm-socket-client',
      branchName: branchName,
      directoryName: 'services',
      artifactBucket: artifactBucket
    });

    new ssm.StringParameter(this, 'RepositorySSM', {
      description: 'Repository for the Web3 Socket Client',
      parameterName: `/repositories/websockets/evm-client`,
      stringValue: repository.repositoryName,
    });
  }
}
