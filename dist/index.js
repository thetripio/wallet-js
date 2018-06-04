'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Wallet = _interopDefault(require('ethereumjs-wallet'));
var ethUtil = _interopDefault(require('ethereumjs-util'));
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
            var priv = ethUtil.toBuffer(key);
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
    }, {
        key: 'setProvider',
        value: function setProvider(host) {
            web3.setProvider(new Web3.providers.HttpProvider(host));
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
            return new Promise(function (resolve, reject) {
                web3.eth.getTransaction(transactionHash, function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        }
    }, {
        key: 'getTransactions',
        value: function getTransactions(addressHexString) {
            console.log('please try https://etherscan.io/apis');
            //http://api.etherscan.io/api?module=account&action=txlist&address=0xb02d5da39628918daa9545388f1abb60be368e0a
        }
    }, {
        key: 'sendTransaction',
        value: function sendTransaction(transactionObject) {}
    }, {
        key: '_encodeAbi',
        value: function _encodeAbi() {}
    }, {
        key: '_signTx',
        value: function _signTx() {}
    }, {
        key: 'test',
        value: function test() {

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
