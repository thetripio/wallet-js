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
                if (err) {
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
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }

    getTransaction(transactionHash) {
        return new Promise((resolve, reject) => {
            web3.eth.getTransaction(transactionHash, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }

    test() {

        // console.log(web3.eth.accounts); 
        // console.log(web3.eth.defaultBlock); 
        // console.log(web3.eth.blockNumber);
        // console.log(web3.eth.getBlock(0));

        // console.log(web3.eth.getTransactionCount(web3.eth.accounts[0]));

        // var transaction = web3.eth.getTransactionFromBlock('latest', 0);
        // console.log(transaction);

        let filter = web3.eth.filter({
            address: '0xb02d5da39628918daa9545388f1abb60be368e0a'
        });

        filter.get((err, log) => {
            console.log(log);
        });
    }

    getTransactions(addressHexString) {

    }

    sendTransaction(transactionObject) {
        
    }

}