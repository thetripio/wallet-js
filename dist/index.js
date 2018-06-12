'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Wallet = _interopDefault(require('ethereumjs-wallet'));
var EthUtil = _interopDefault(require('ethereumjs-util'));
var Abi = _interopDefault(require('ethereumjs-abi'));
var Transaction = _interopDefault(require('ethereumjs-tx'));
var Web3 = _interopDefault(require('web3'));

var eip20 = [{
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

var web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.1.41:8545'));

/**
 * EthWallet
 * @class EthWallet
 */

var EthWallet = function () {
    function EthWallet() {
        _classCallCheck(this, EthWallet);

        this.currency = 'eth';
    }

    /**
     * generate wallet
     * @return 
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
            var priv = EthUtil.toBuffer(key);
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
            web3.setProvider(new Web3.providers.HttpProvider(host, timeout));
        }
    }, {
        key: 'toWei',
        value: function toWei(num, unit) {
            return web3.toWei(num, unit);
        }
    }, {
        key: 'fromWei',
        value: function fromWei(num, unit) {
            return web3.fromWei(num, unit);
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
                web3.eth.getBalance(addressHexString, function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        }

        /**
         * 
         */

    }, {
        key: 'getTrio',
        value: function getTrio() {}

        /**
         * get token balance
         * @param { String } addressHexString 
         * @param { String } tokenAddress
         * @return { Promise }
         */

    }, {
        key: 'getTokenBalance',
        value: function getTokenBalance(addressHexString, tokenAddress) {
            var contract = web3.eth.contract(eip20);
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
                web3.eth.getTransaction(transactionHash, function (txErr, txRes) {

                    web3.eth.getTransactionReceipt(transactionHash, function (recErr, recRes) {
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
            var contract = web3.eth.contract(abi);

            return contract.at(address);
        }
        /**
         * get trasaction gasLimit
         * @param { Object } transactionObject 
         */

    }, {
        key: 'estimateGas',
        value: function estimateGas(transactionObject) {
            return new Promise(function (resolve, reject) {
                web3.eth.estimateGas(transactionObject, function (err, res) {
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
         */

    }, {
        key: 'sendTransaction',
        value: function sendTransaction(transactionObject) {
            var _this2 = this;

            if (!transactionObject.nonce && transactionObject.nonce !== 0) {
                return this._getTransactionCount(transactionObject.from).then(function (res) {
                    transactionObject.nonce = res;
                    return _this2._sendTransaction(transactionObject);
                });
            } else {
                return this._sendTransaction(transactionObject);
            }
        }
    }, {
        key: '_sendTransaction',
        value: function _sendTransaction(transactionObject) {
            var _this3 = this;

            var txObj = {},
                needSign = false,
                contractMethod = void 0;

            if (transactionObject.contract) {
                contractMethod = this._getContractMethod(transactionObject.contract, transactionObject.methodName);

                needSign = !contractMethod.constant;

                txObj = {
                    from: transactionObject.from,
                    to: transactionObject.contract.address || transactionObject.to,
                    value: transactionObject.value,
                    gasLimit: transactionObject.gasLimit,
                    gasPrice: transactionObject.gasPrice,
                    data: this._encodeAbi(contractMethod, transactionObject.arguments),
                    nonce: transactionObject.nonce
                };
            } else {
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

            return new Promise(function (resolve, reject) {
                if (needSign) {
                    var serialize = _this3._signTx(txObj, transactionObject.privateKey);

                    web3.eth.sendRawTransaction(serialize, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    });
                } else {
                    web3.eth.call(txObj, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(_this3._decodeAbi(contractMethod, res));
                        }
                    });
                }
            });
        }
    }, {
        key: '_getTransactionCount',
        value: function _getTransactionCount(address) {
            return new Promise(function (resolve, reject) {
                web3.eth.getTransactionCount(address, function (err, res) {
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
         * encode ABI with contract
         * @param { Object } contractMethod 
         * @param { Array } args 
         */

    }, {
        key: '_encodeAbi',
        value: function _encodeAbi(contractMethod, args) {
            var methodId = Abi.methodID(contractMethod.name, contractMethod.types);
            var encoded = Abi.rawEncode(contractMethod.types, args);

            return '0x' + methodId.toString('hex') + encoded.toString('hex');
        }

        /**
         * decode ABI with contract
         * @param { Object } contractMethod
         * @param { String } data 
         */

    }, {
        key: '_decodeAbi',
        value: function _decodeAbi(contractMethod, data) {
            var decoded = data;

            if (contractMethod) {
                decoded = Abi.rawDecode(contractMethod.returns, EthUtil.toBuffer(data));
                decoded = decoded.toString('hex');
            }

            return decoded;
        }

        /**
         * sigin transaction with private key
         * @param { Object } transactionObject 
         * @param { String } privateKey 
         */

    }, {
        key: '_signTx',
        value: function _signTx(transactionObject, privateKey) {
            var tx = new Transaction(transactionObject);
            var pk = EthUtil.toBuffer(privateKey);
            tx.sign(pk);
            var serialize = tx.serialize();

            return serialize ? '0x' + serialize.toString('hex') : '';
        }
    }, {
        key: '_test',
        value: function _test() {

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
    }]);

    return EthWallet;
}();

var index = (function (type) {

    // TODO: use factory method create wallet

    return new EthWallet();
});

module.exports = index;
