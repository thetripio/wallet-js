import Wallet from 'ethereumjs-wallet';
import Web3 from 'web3';
import Util from './eth-util';
import Eip20 from './eth-eip-20';

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
        var priv = Util.toBuffer(key);
        this._importPrivateKey(priv)
    }

    _importPrivateKey(priv) {
        var wallet = Wallet.fromPrivateKey(priv);

        this.privateKey = wallet.getPrivateKeyString();
        this.publicKey = wallet.getPublicKeyString();
        this.address = wallet.getAddressString();
    }

    /**
     * set provider
     * @param { String } host 
     * @param { Number } timeout 
     */
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
     * get token balance
     * @param { String } addressHexString 
     * @param { String } tokenAddress
     * @return { Promise }
     */
    getTokenBalance(addressHexString, tokenAddress) {
        let contract = web3.eth.contract(Eip20);
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
            web3.eth.getTransaction(transactionHash, (txErr, txRes) => {

                web3.eth.getTransactionReceipt(transactionHash, (recErr, recRes) => {
                    if (txErr && recErr) {
                        reject(txErr + recErr);
                    }
                    else {
                        let tx = {};

                        if (txRes && recRes) {
                            tx = this._mergeTransaction(txRes, recRes);
                        }
                        else {
                            tx = txRes || recRes;
                        }

                        resolve(tx);
                    }
                });
            });
        });
    }

    _mergeTransaction(transaction, receipt) {

        let tx = {};

        for (let key in transaction) {
            tx[key] = transaction[key];
        }

        for (let key in receipt) {
            tx[key] = tx[key] || receipt[key];
        }

        return tx;
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
     * get trasaction gasLimit
     * @param { Object } transactionObject 
     */
    estimateGas(transactionObject) {
        return new Promise((resolve, reject) => {
            web3.eth.estimateGas(transactionObject, (err, res) => {
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
     * send transaction
     * @param { Object } transactionObject
     */
    sendTransaction(transactionObject) {
        if (!transactionObject.nonce && transactionObject.nonce !== 0) {
            return this.getTransactionCount(transactionObject.from).then(res => {
                transactionObject.nonce = res;
                return this._sendTransaction(transactionObject);
            });
        }
        else {
            return this._sendTransaction(transactionObject);
        }
    }

    _sendTransaction(transactionObject) {
        let txObj = {}, needSign = false, contractMethod;

        if (transactionObject.contract) {
            contractMethod = this._getContractMethod(transactionObject.contract, transactionObject.methodName);

            needSign = !contractMethod.constant;

            txObj = {
                from: transactionObject.from,
                to: transactionObject.contract.address || transactionObject.to,
                value: transactionObject.value,
                gasLimit: transactionObject.gasLimit,
                gasPrice: transactionObject.gasPrice,
                data: Util.encodeAbi(contractMethod.name, contractMethod.types, transactionObject.arguments),
                nonce: transactionObject.nonce
            };
        }
        else {
            needSign = true;

            txObj = {
                from: transactionObject.from,
                to: transactionObject.to,
                value: transactionObject.value,
                gasLimit: transactionObject.gasLimit,
                gasPrice: transactionObject.gasPrice,
                data: transactionObject.data || '0x',
                nonce: transactionObject.nonce
            };
        }

        return new Promise((resolve, reject) => {
            if (needSign) {
                let serialize = Util.signTransaction(txObj, transactionObject.privateKey);

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
                web3.eth.call(txObj, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(Util.decodeAbi(contractMethod.returns, res));
                    }
                });
            }
        });

    }

    transaction(transactionObject) {
        let txObj = {}, needSign = false, contractMethod;

        if (transactionObject.contract) {
            contractMethod = this._getContractMethod(transactionObject.contract, transactionObject.methodName);

            needSign = !contractMethod.constant;

            txObj = {
                from: transactionObject.from,
                to: transactionObject.contract.address || transactionObject.to,
                value: transactionObject.value,
                gasLimit: transactionObject.gasLimit,
                gasPrice: transactionObject.gasPrice,
                data: Util.encodeAbi(contractMethod.name, contractMethod.types, transactionObject.arguments),
                nonce: transactionObject.nonce
            };
        }
        else {
            needSign = true;

            txObj = {
                from: transactionObject.from,
                to: transactionObject.to,
                value: transactionObject.value,
                gasLimit: transactionObject.gasLimit,
                gasPrice: transactionObject.gasPrice,
                data: transactionObject.data || '0x',
                nonce: transactionObject.nonce
            };
        }

        return {
            instance: txObj,
            needSign: needSign
        };
    }

    getTransactionCount(address) {
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionCount(address, (err, res) => {
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
     * get contract method with method name
     * @param { Object } contract 
     * @param { String } methodName 
     */
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
                    method.returns = [];
                    for(let j = 0; j < abi.inputs.length; j++) {
                        method.types.push(abi.inputs[j].type);
                    }
                    for(let k = 0; k < abi.outputs.length; k++) {
                        method.returns.push(abi.outputs[k].type);
                    }
                }

                break;
            }
        }

        return method;
    }

    gasPrice() {
        return new Promise((resolve, reject) => {
            web3.eth.getGasPrice((err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }

    _test() {

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