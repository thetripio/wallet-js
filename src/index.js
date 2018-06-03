import EthWallet from './lib/eth/eth-wallet';
import BtcWallet from './lib/btc/btc-wallet';

export default (type) => {

    // TODO: use factory method create wallet

    return new EthWallet();
};