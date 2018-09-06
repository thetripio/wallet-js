'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Web3 = _interopDefault(require('web3'));
var EthUtil = _interopDefault(require('ethereumjs-util'));
var Transaction = _interopDefault(require('ethereumjs-tx'));
var Abi = _interopDefault(require('ethereumjs-abi'));
var Secp256k1 = _interopDefault(require('secp256k1'));
var Wallet = _interopDefault(require('ethereumjs-wallet'));

let web3 = new Web3();

/**
 * EthUtil
 * @module EthUtil
 */
var Util = {
  /**
   * convert unit to wei
   * @param { Number | String | BigNumber }
   * @param { String } uint: tether|gether|mether|kether|ether|finney|szabo|gwei|mwei|kwei
   * @returns { String|BigNumber }
   */
  toWei: (num, unit) => {
    return web3.toWei(num, unit);
  },
  /**
   * convert unit from wei
   * @param { Number | String | BigNumber }
   * @param { String } uint: tether|gether|mether|kether|ether|finney|szabo|gwei|mwei|kwei
   * @returns { String|BigNumber }
   */
  fromWei: (num, unit) => {
    return web3.fromWei(num, unit);
  },
  /**
   * convert string or number to bigNumber
   * @param { String | Number }
   * @returns { Object }
   */
  toBigNumber: value => {
    return web3.toBigNumber(value);
  },
  /**
   * convert string to buffer
   * @param { String }
   * @returns { Object }
   */
  toBuffer: any => {
    return EthUtil.toBuffer(any);
  },
  /**
   * convert string to hex
   */
  toHex: any => {
    return web3.toHex(any);
  },
  fromHex: () => {},
  /**
   * verify private key
   * @param { String } privateKey
   * @returns { Boolean }
   */
  verifyPrivateKey: privateKey => {
    let pk = EthUtil.toBuffer(privateKey);

    return pk.length == 32 && Secp256k1.privateKeyVerify(pk);
  },
  /**
   * encode ABI with contract
   * @param { String } methodName
   * @param { Array } types
   * @param { Array } args
   * @return { String }
   */
  encodeAbi: (methodName, types, args) => {
    let methodId = Abi.methodID(methodName, types);
    let encoded = Abi.rawEncode(types, args);

    return '0x' + methodId.toString('hex') + encoded.toString('hex');
  },
  /**
   * decode ABI with contract
   * @param { Array } types
   * @param { String } data
   * @return { String }
   */
  decodeAbi: (types, data) => {
    let decoded = Abi.rawDecode(types, EthUtil.toBuffer(data));

    return decoded.toString('hex');
  },
  /**
   * 
   * @param { Object } transactionObject
   * @param { String } privateKey
   * @return { String }
   */
  signTransaction: (transactionObject, privateKey) => {
    let tx = new Transaction(transactionObject);
    tx.sign(EthUtil.toBuffer(privateKey));

    let serialize = tx.serialize().toString('hex');

    return '0x' + serialize;
  }
};

var Eip20 = [{
    "constant": false,
    "inputs": [{
        "name": "_spender",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_from",
        "type": "address"
    }, {
        "name": "_to",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "name": "balance",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }, {
        "name": "_spender",
        "type": "address"
    }],
    "name": "allowance",
    "outputs": [{
        "name": "remaining",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_from",
        "type": "address"
    }, {
        "indexed": true,
        "name": "_to",
        "type": "address"
    }, {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_owner",
        "type": "address"
    }, {
        "indexed": true,
        "name": "_spender",
        "type": "address"
    }, {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
    }],
    "name": "Approval",
    "type": "event"
}];

let web3$1 = new Web3(new Web3.providers.HttpProvider('http://192.168.1.41:8545'));

/**
 * EthWallet
 * @class EthWallet
 */
class EthWallet {
    constructor() {
        this.currency = 'eth';
        this.web3 = web3$1;
    }

    /**
     * generate wallet
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
        this._importPrivateKey(priv);
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
        web3$1.setProvider(new Web3.providers.HttpProvider(host, timeout));
    }

    /**
     * get balance
     * @param { String } addressHexString 
     * @return { Promise }
     */
    getBalance(addressHexString) {
        return new Promise((resolve, reject) => {
            web3$1.eth.getBalance(addressHexString, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    /**
     * get token balance
     * @param { String } addressHexString 
     * @param { String } tokenAddress
     * @return { Promise }
     */
    getTokenBalance(addressHexString, tokenAddress) {
        let contract = web3$1.eth.contract(Eip20);
        let contractInstance = contract.at(tokenAddress);

        return new Promise((resolve, reject) => {
            contractInstance.balanceOf(addressHexString, (err, res) => {
                if (err) {
                    reject(err);
                } else {
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
            web3$1.eth.getTransaction(transactionHash, (txErr, txRes) => {

                web3$1.eth.getTransactionReceipt(transactionHash, (recErr, recRes) => {
                    if (txErr && recErr) {
                        reject(txErr + recErr);
                    } else {
                        let tx = {};

                        if (txRes && recRes) {
                            tx = this._mergeTransaction(txRes, recRes);
                        } else {
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
        console.log('please try https://etherscan.io/apis');
        //http://api.etherscan.io/api?module=account&action=txlist&address=0xb02d5da39628918daa9545388f1abb60be368e0a
    }

    /**
     * create contract instance
     * @param { Array } abi 
     * @param { String } address 
     */
    contract(abi, address) {
        let contract = web3$1.eth.contract(abi);

        return contract.at(address);
    }
    /**
     * get trasaction gasLimit
     * @param { Object } transactionObject 
     * @return { Promise }
     */
    estimateGas(transactionObject) {
        return new Promise((resolve, reject) => {
            let txObj = this._createTransaction(transactionObject);
            delete txObj._contractMethod;

            web3$1.eth.estimateGas(txObj, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    /**
     * send transaction
     * @param { Object } transactionObject
     * @return { Promise }
     */
    sendTransaction(transactionObject) {
        if (!transactionObject.nonce && transactionObject.nonce !== 0) {
            return this.getTransactionCount(transactionObject.from).then(res => {
                transactionObject.nonce = res;
                return this._sendTransaction(transactionObject);
            });
        } else {
            return this._sendTransaction(transactionObject);
        }
    }

    _sendTransaction(transactionObject) {
        let txObj = this._createTransaction(transactionObject);
        let contractMethod = txObj._contractMethod;
        let needSign = true;

        if (txObj._contractMethod) {
            needSign = !txObj._contractMethod.constant;
        }

        return new Promise((resolve, reject) => {
            delete txObj._contractMethod;

            if (needSign) {
                let serialize = Util.signTransaction(txObj, transactionObject.privateKey);

                web3$1.eth.sendRawTransaction(serialize, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            } else {
                web3$1.eth.call(txObj, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(Util.decodeAbi(contractMethod.returns, res));
                    }
                });
            }
        });
    }

    _createTransaction(transactionObject) {
        let txObj = {};

        if (transactionObject.contract) {
            let contractMethod = this._getContractMethod(transactionObject.contract, transactionObject.methodName);

            txObj = {
                from: transactionObject.from,
                to: transactionObject.contract.address || transactionObject.to,
                value: transactionObject.value,
                gasLimit: transactionObject.gasLimit,
                gasPrice: transactionObject.gasPrice,
                data: Util.encodeAbi(contractMethod.name, contractMethod.types, transactionObject.arguments),
                nonce: transactionObject.nonce,
                _contractMethod: contractMethod
            };
        } else {

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

        return txObj;
    }

    getTransactionCount(address) {
        return new Promise((resolve, reject) => {
            web3$1.eth.getTransactionCount(address, (err, res) => {
                if (err) {
                    reject(err);
                } else {
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
                    for (let j = 0; j < abi.inputs.length; j++) {
                        method.types.push(abi.inputs[j].type);
                    }
                    for (let k = 0; k < abi.outputs.length; k++) {
                        method.returns.push(abi.outputs[k].type);
                    }
                }

                break;
            }
        }

        return method;
    }

    /**
     * get gas price
     * @return { Promise }
     */
    gasPrice() {
        return new Promise((resolve, reject) => {
            web3$1.eth.getGasPrice((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
}

//import BtcWallet from './lib/btc/btc-wallet';

var index = (type => {
    // TODO: use factory method create wallet

    return new EthWallet();
});

exports.default = index;
exports.EthUtil = Util;
