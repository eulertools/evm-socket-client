import { BlockHeader } from "web3-eth"
import { PublishCommand, PublishCommandOutput, SNSClient } from '@aws-sdk/client-sns';
import { SendMessageCommand, SendMessageCommandOutput, SQSClient } from '@aws-sdk/client-sqs';

import { web3, provider } from './web3';
import { EventStatus } from './config/types/eventStatus';
import { appConfig } from './config/default';

const {aws_config, config} = appConfig();

const {CONNECTED, DATA, ERROR} = EventStatus;

const snsClient = new SNSClient({region: aws_config.region});
const sqsClient = new SQSClient({region: aws_config.region});

const blockClient = async(web3:any) => {

  const subscription = web3.eth.subscribe('newBlockHeaders', (err: Error, res: BlockHeader) => {
    if (err) {
      console.error(JSON.stringify(err));
    }
  });

  subscription
    .on(CONNECTED, (e: string) => {
      console.log('Block Client Connected', JSON.stringify(e));
    })
    .on(DATA, (blockHeader: BlockHeader) => {

      if (process.env.SQS_ENQUEUER) {
        const command = new SendMessageCommand({
          MessageBody: JSON.stringify({
            block_number: blockHeader.number.toString(),
            block_timestamp: blockHeader.timestamp.toString(),
          }),
          QueueUrl: process.env.QUEUE_URL,
          DelaySeconds: 0,
        });

        sqsClient
          .send(command)
          .then((data: SendMessageCommandOutput) => {
            if (data.$metadata.httpStatusCode! >= 400) {
              console.error(
                JSON.stringify({
                  message: JSON.stringify(data),
                  block_number: blockHeader.number,
                  status: 500,
                  chain: config.chain_id,
                })
              );
            }
            console.log(
              JSON.stringify({
                message: 'Block Enqueued successfully',
                block_number: blockHeader.number,
                status: 200,
                chain: config.chain_id,
              })
            );
          })
          .catch((error: any) => {
            console.log(error);
            throw error;
          });
      } else {
        const command = new PublishCommand({
          Message: blockHeader.number.toString(),
          TopicArn: config.new_block_topic,
        });

        snsClient.send(command).then((data: PublishCommandOutput) => {
          if (data.$metadata.httpStatusCode! >= 400) {
            console.error('Error on topic send', JSON.stringify(data));
          }
          console.log({status: 'success', blockHeader: blockHeader.number});
        });
      }
    })
    .on(ERROR, (error: Error) => {
      console.error('Connection Error In Block Client', JSON.stringify(error));
    });

    const isAlive = () => {
      subscription._events.connected = [subscription._events.connected[0]]
      if (!web3.currentProvider.connected) {
        web3.setProvider(provider);
      }
    };
  
    setInterval(isAlive, 1000);
};

const service = async () => {
  console.log("Started service")
  blockClient(web3);
};

setTimeout(() => {
  try {
    service();
  } catch (e) {
    console.log(e);
  }
}, 99);
