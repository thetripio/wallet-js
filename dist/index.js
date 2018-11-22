'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Web3 = _interopDefault(require('web3'));
var EthUtil = _interopDefault(require('ethereumjs-util'));
var Transaction = _interopDefault(require('ethereumjs-tx'));
var Abi = _interopDefault(require('ethereumjs-abi'));
var Secp256k1 = _interopDefault(require('secp256k1'));
var Wallet = _interopDefault(require('ethereumjs-wallet'));

var web3 = new Web3();

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
  toWei: function toWei(num, unit) {
    return web3.toWei(num, unit);
  },
  /**
   * convert unit from wei
   * @param { Number | String | BigNumber }
   * @param { String } uint: tether|gether|mether|kether|ether|finney|szabo|gwei|mwei|kwei
   * @returns { String|BigNumber }
   */
  fromWei: function fromWei(num, unit) {
    return web3.fromWei(num, unit);
  },
  /**
   * convert string or number to bigNumber
   * @param { String | Number }
   * @returns { Object }
   */
  toBigNumber: function toBigNumber(value) {
    return web3.toBigNumber(value);
  },
  /**
   * convert string to buffer
   * @param { String }
   * @returns { Object }
   */
  toBuffer: function toBuffer(any) {
    return EthUtil.toBuffer(any);
  },
  /**
   * convert string to hex
   */
  toHex: function toHex(any) {
    return web3.toHex(any);
  },
  fromHex: function fromHex() {},
  /**
   * verify private key
   * @param { String } privateKey
   * @returns { Boolean }
   */
  verifyPrivateKey: function verifyPrivateKey(privateKey) {
    var pk = EthUtil.toBuffer(privateKey);

    return pk.length == 32 && Secp256k1.privateKeyVerify(pk);
  },
  /**
   * encode ABI with contract
   * @param { String } methodName
   * @param { Array } types
   * @param { Array } args
   * @return { String }
   */
  encodeAbi: function encodeAbi(methodName, types, args) {
    var methodId = Abi.methodID(methodName, types);
    var encoded = Abi.rawEncode(types, args);

    return '0x' + methodId.toString('hex') + encoded.toString('hex');
  },
  /**
   * decode ABI with contract
   * @param { Array } types
   * @param { String } data
   * @return { String }
   */
  decodeAbi: function decodeAbi(types, data) {
    var decoded = Abi.rawDecode(types, EthUtil.toBuffer(data));

    return decoded.toString('hex');
  },
  /**
   * 
   * @param { Object } transactionObject
   * @param { String } privateKey
   * @return { String }
   */
  signTransaction: function signTransaction(transactionObject, privateKey) {
    var tx = new Transaction(transactionObject);
    tx.sign(EthUtil.toBuffer(privateKey));

    var serialize = tx.serialize().toString('hex');

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var web3$1 = new Web3(new Web3.providers.HttpProvider('http://192.168.1.41:8545'));

/**
 * EthWallet
 * @class EthWallet
 */

var EthWallet = function () {
    function EthWallet() {
        _classCallCheck(this, EthWallet);

        this.currency = 'eth';
        this.web3 = web3$1;
    }

    /**
     * generate wallet
     */


    _createClass(EthWallet, [{
        key: 'generate',
        value: function generate() {
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

    }, {
        key: 'import',
        value: function _import(key, type) {
            var priv = Util.toBuffer(key);
            this._importPrivateKey(priv);
        }
    }, {
        key: '_importPrivateKey',
        value: function _importPrivateKey(priv) {
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

    }, {
        key: 'setProvider',
        value: function setProvider(host, timeout) {
            web3$1.setProvider(new Web3.providers.HttpProvider(host, timeout));
        }

        /**
         * get balance
         * @param { String } addressHexString 
         * @return { Promise }
         */

    }, {
        key: 'getBalance',
        value: function getBalance(addressHexString) {
            return new Promise(function (resolve, reject) {
                web3$1.eth.getBalance(addressHexString, function (err, res) {
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

    }, {
        key: 'getTokenBalance',
        value: function getTokenBalance(addressHexString, tokenAddress) {
            var contract = web3$1.eth.contract(Eip20);
            var contractInstance = contract.at(tokenAddress);

            return new Promise(function (resolve, reject) {
                contractInstance.balanceOf(addressHexString, function (err, res) {
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

    }, {
        key: 'getTransaction',
        value: function getTransaction(transactionHash) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                web3$1.eth.getTransaction(transactionHash, function (txErr, txRes) {

                    web3$1.eth.getTransactionReceipt(transactionHash, function (recErr, recRes) {
                        if (txErr && recErr) {
                            reject(txErr + recErr);
                        } else {
                            var tx = {};

                            if (txRes && recRes) {
                                tx = _this._mergeTransaction(txRes, recRes);
                            } else {
                                tx = txRes || recRes;
                            }

                            resolve(tx);
                        }
                    });
                });
            });
        }
    }, {
        key: '_mergeTransaction',
        value: function _mergeTransaction(transaction, receipt) {

            var tx = {};

            for (var key in transaction) {
                tx[key] = transaction[key];
            }

            for (var _key in receipt) {
                tx[_key] = tx[_key] || receipt[_key];
            }

            return tx;
        }
    }, {
        key: 'getTransactions',
        value: function getTransactions(addressHexString) {
            console.log('please try https://etherscan.io/apis');
            //http://api.etherscan.io/api?module=account&action=txlist&address=0xb02d5da39628918daa9545388f1abb60be368e0a
        }

        /**
         * create contract instance
         * @param { Array } abi 
         * @param { String } address 
         */

    }, {
        key: 'contract',
        value: function contract(abi, address) {
            var contract = web3$1.eth.contract(abi);

            return contract.at(address);
        }
        /**
         * get trasaction gasLimit
         * @param { Object } transactionObject 
         * @return { Promise }
         */

    }, {
        key: 'estimateGas',
        value: function estimateGas(transactionObject) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var txObj = _this2._createTransaction(transactionObject);
                delete txObj._contractMethod;

                web3$1.eth.estimateGas(txObj, function (err, res) {
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

    }, {
        key: 'sendTransaction',
        value: function sendTransaction(transactionObject) {
            var _this3 = this;

            if (!transactionObject.nonce && transactionObject.nonce !== 0) {
                return this.getTransactionCount(transactionObject.from).then(function (res) {
                    transactionObject.nonce = res;
                    return _this3._sendTransaction(transactionObject);
                });
            } else {
                return this._sendTransaction(transactionObject);
            }
        }
    }, {
        key: '_sendTransaction',
        value: function _sendTransaction(transactionObject) {
            var txObj = this._createTransaction(transactionObject);
            var contractMethod = txObj._contractMethod;
            var needSign = true;

            if (txObj._contractMethod) {
                needSign = !txObj._contractMethod.constant;
            }

            return new Promise(function (resolve, reject) {
                delete txObj._contractMethod;

                if (needSign) {
                    var serialize = Util.signTransaction(txObj, transactionObject.privateKey);

                    web3$1.eth.sendRawTransaction(serialize, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    });
                } else {
                    web3$1.eth.call(txObj, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    });
                }
            });
        }
    }, {
        key: '_createTransaction',
        value: function _createTransaction(transactionObject) {
            var txObj = {};

            if (transactionObject.contract) {
                var contractMethod = this._getContractMethod(transactionObject.contract, transactionObject.methodName);

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
    }, {
        key: 'getTransactionCount',
        value: function getTransactionCount(address) {
            return new Promise(function (resolve, reject) {
                web3$1.eth.getTransactionCount(address, function (err, res) {
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

    }, {
        key: '_getContractMethod',
        value: function _getContractMethod(contract, methodName) {
            var method = {};
            for (var i = 0; i < contract.abi.length; i++) {
                var abi = contract.abi[i];

                if (abi.name == methodName) {

                    method = {
                        name: abi.name,
                        constant: abi.constant
                    };

                    if (abi.inputs && abi.inputs.length > 0) {
                        method.types = [];
                        method.returns = [];
                        for (var j = 0; j < abi.inputs.length; j++) {
                            method.types.push(abi.inputs[j].type);
                        }
                        for (var k = 0; k < abi.outputs.length; k++) {
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

    }, {
        key: 'gasPrice',
        value: function gasPrice() {
            return new Promise(function (resolve, reject) {
                web3$1.eth.getGasPrice(function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        }
    }]);

    return EthWallet;
}();

//import BtcWallet from './lib/btc/btc-wallet';

var index = (function (type) {
    // TODO: use factory method create wallet

    return new EthWallet();
});

exports.default = index;
exports.EthUtil = Util;
