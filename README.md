# Trip Wallet SDK for JavaScript

## Install

```
yarn add trip-wallet
Or
npm install trip-wallet
```

## Usage

```
import Wallet from 'trip-wallet';

let wallet = Wallet('eth');
wallet.generate();
wallet.setProvider('http://host:port');

// async/await
let balance = await wallet.getBalance(wallet.address);

// Promise
wallet.getBalance(wallet.address).then(res => {
    balance = res;
}, err => {

});

```

## API

### wallet
* Attributes
    * privateKey: String (hex string)
    * publicKey: String (hex string)
    * address: String (hex string)
    * currency: String
    * transactionObject
        * contract: Object
        * methodName: String
        * arguments: Array[]
        * privateKey: String (hex string)
        * from: String (hex string)
        * to: String (hex string)
        * value: Number | String | BigNumber
        * gasLimit: Number | String | BigNumber
        * gasPrice: Number | String | BigNumber
        * data: String
        * none: Number
* Methods
    * generate([currency]): Object
    * import(key [, type] [, currency]): Object
        * type: 'privateKey', 'keystore', 'mnemonicPhrase', 'readonly'
        * key: String
        * currency: String
    * setProvider(host)
    * getBalance(addressHexString): Promise
    * getTokenBalance(addressHexString, contractAddress): Promise
    * getTransaction(transactionHash): Promise
    * contract(abi, address): Object
    * estimateGas(transactionObject): Promise
    * gasPrice(): Promise
    * sendTransaction(transactionObject): Promise

### eth-util
* toWei(num, unit)
* fromWei(num, unit)
* toBigNumber
* toBuffer
* toHex
* verifyPrivateKey
* decodeAbi
* encodeAbi
* signTransaction