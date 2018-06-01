import Wallet from 'ethereumjs-wallet';
import ethUtil from 'ethereumjs-util';
import Web3 from 'web3';
import eip20 from './eth-eip-20';

let web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.1.41:8545'));

export default class EthWallet {
    constructor() {
        this.currency = 'eth';
    }

    generate() {
        var wallet = Wallet.generate();

        this.privateKey = wallet.getPrivateKeyString();
        this.publicKey = wallet.getPublicKeyString();
        this.address = wallet.getAddressString();
    }

    import(key, type) {
        var priv = ethUtil.toBuffer(key);
        this._importPrivateKey(priv)
    }

    _importPrivateKey(priv) {
        var wallet = Wallet.fromPrivateKey(priv);

        this.privateKey = wallet.getPrivateKeyString();
        this.publicKey = wallet.getPublicKeyString();
        this.address = wallet.getAddressString();
    }

    _encodeAbi() {

    }

    _signTx() {

    }

    setProvider(host) {
        web3.setProvider(new Web3.providers.HttpProvider(host));
    }

    getBalance(addressHexString) {
        return new Promise((resolve, reject) => {
            web3.eth.getBalance(addressHexString, (err, res) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            })
        });
    }

    getTokenBalance(addressHexString, tokenAddress) {
        let contract = web3.eth.contract(eip20);
        let contractInstance = contract.at(tokenAddress);

        return new Promise((resolve, reject) => {
            contractInstance.balanceOf(addressHexString, (err, res) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }

    getTransaction(transactionHash) {

    }

    getTransactions(addressHexString) {

    }

    sendTransaction(transactionObject) {

    }

}