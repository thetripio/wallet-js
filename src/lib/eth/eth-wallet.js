import Wallet from 'ethereumjs-wallet';
import EthUtil from 'ethereumjs-util';
var Abi = require('ethereumjs-abi');
import Transaction from 'ethereumjs-tx';
import Web3 from 'web3';
import eip20 from './eth-eip-20';

let web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.1.41:8545'));

/**
 * EthWallet
 * @class EthWallet
 */
export default class EthWallet {
    constructor() {
        this.currency = 'eth';
    }

    /**
     * generate wallet
     * @return 
     */
    generate() {
        var wallet = Wallet.generate();

        this.privateKey = wallet.getPrivateKeyString();
        this.publicKey = wallet.getPublicKeyString();
        this.address = wallet.getAddressString();
    }

    /**
     * generate wallet from privatekey or keystore or mnemonicPhrase or publicKey
     * @param { String } key 
     * @param { String } type : 'privateKey', 'keystore', 'mnemonicPhrase', 'readonly'
     */
    import(key, type) {
        var priv = EthUtil.toBuffer(key);
        this._importPrivateKey(priv)
    }

    _importPrivateKey(priv) {
        var wallet = Wallet.fromPrivateKey(priv);

        this.privateKey = wallet.getPrivateKeyString();
        this.publicKey = wallet.getPublicKeyString();
        this.address = wallet.getAddressString();
    }

    setProvider(host, timeout) {
        web3.setProvider(new Web3.providers.HttpProvider(host, timeout));
    }

    /**
     * get balance
     * @param { String } addressHexString 
     * @return { Promise }
     */
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

    /**
     * 
     */
    getTrio() {
        
    }

    /**
     * get token balance
     * @param { String } addressHexString 
     * @param { String } tokenAddress
     * @return { Promise }
     */
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

    /**
     * get transaction
     * @param { String } transactionHash 
     * @return { Promise }
     */
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

        /** TODO:
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionReceipt(transactionHash, (err, res) => {
                if (err) {
                    reject(err);
                }
                else if(res) {
                    resolve(res);
                }
                else if(!res) {
                    web3.eth.getTransaction(transactionHash, (err, res) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(res);
                        }
                    });
                }
            });
        });
        **/
    }

    // TODO: merge to getTransaction
    getTransactionReceipt(transactionHash) {
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionReceipt(transactionHash, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }

    getTransactions(addressHexString) {
        console.log('please try https://etherscan.io/apis')
        //http://api.etherscan.io/api?module=account&action=txlist&address=0xb02d5da39628918daa9545388f1abb60be368e0a
    }

    /**
     * create contract instance
     * @param { Array } abi 
     * @param { String } address 
     */
    contract(abi, address) {
        let contract = web3.eth.contract(abi);

        return contract.at(address);
    }

    /**
     * send transaction
     * @param { Object } transactionObject
     */
    sendTransaction(transactionObject) {
        let needSign = false;

        let txObj = {};

        if (transactionObject.contract) {
            let contractMethod = this._getContractMethod(transactionObject.contract, transactionObject.methodName);

            needSign = !contractMethod.constant;

            console.log('contractMethod');
            console.log(contractMethod.types);
            console.log(transactionObject.arguments);

            let methodId = Abi.methodID(transactionObject.methodName, contractMethod.types);
            let encoded = Abi.rawEncode(contractMethod.types, transactionObject.arguments);
            let data = '0x' + methodId.toString('hex') + encoded.toString('hex');

            txObj = {
                from: transactionObject.from,
                to: transactionObject.contract.address || transactionObject.to,
                value: transactionObject.value,
                gas: transactionObject.gas,
                gasPrice: transactionObject.gasPrice,
                data: data,
                nonce: transactionObject.nonce
            };
            console.log(txObj)
        }
        else {
            needSign = true;

            txObj = {
                from: transactionObject.from,
                to: transactionObject.to,
                value: transactionObject.value,
                gas: transactionObject.gas,
                gasPrice: transactionObject.gasPrice,
                data: transactionObject.data,
                nonce: transactionObject.nonce
            };
        }

        return new Promise((resolve, reject) => {

            if (needSign) {

                let serialize = this._signTx(txObj, transactionObject.privateKey);

                web3.eth.sendRawTransaction(serialize, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            }
            else {
                web3.eth.sendTransaction(txObj, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            }

        });
    }

    _getContractMethod(contract, methodName) {
        let method = {};
        for (let i = 0; i < contract.abi.length; i++) {
            let abi = contract.abi[i];

            if (abi.name == methodName) {

                method = {
                    name: abi.name,
                    constant: abi.constant
                };

                if (abi.inputs && abi.inputs.length > 0) {
                    method.types = [];
                    for(let j = 0; j < abi.inputs.length; j++) {
                        method.types.push(abi.inputs[j].type);
                    }
                }

                break;
            }
        }

        return method;
    }

    _signTx(transactionObject, privateKey) {
        let tx = new Transaction(transactionObject);
        tx.sign(privateKey);
        let serialize = tx.serialize();

        return serialize ? serialize.toString('hex') : '';
    }

    test() {

        console.log(web3.eth.accounts);
        console.log(web3.eth.defaultBlock);
        console.log(web3.eth.blockNumber);
        console.log(web3.eth.getBlock(50601));

        // console.log(web3.eth.getTransactionCount(web3.eth.accounts[0]));

        // var transaction = web3.eth.getTransactionFromBlock('latest', 0);
        // console.log(transaction);

        // let filter = web3.eth.filter({
        //     address: '0xb02d5da39628918daa9545388f1abb60be368e0a'
        // });

        // filter.get((err, log) => {
        //     console.log(log);
        // });
    }

}