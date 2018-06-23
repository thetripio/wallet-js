import EthWallet from './lib/eth/eth-wallet';
import EthUtil from './lib/eth/eth-util';
//import BtcWallet from './lib/btc/btc-wallet';

export default (type) => {
    // TODO: use factory method create wallet

    return new EthWallet();
};

export { EthUtil };