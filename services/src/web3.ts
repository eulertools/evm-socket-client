import Web3WsProvider  from "web3-providers-ws";
import Web3 from "web3";

import { appConfig, providerOptions } from './config/default';

const {config} = appConfig();

export const provider = new Web3WsProvider(config.full_wss, providerOptions);

export const web3 = new Web3(provider);
