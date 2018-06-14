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
    * privateKey
    * publicKey
    * address
    * currency
    * transactionObject
        * [contract]
        * [methodName]
        * [arguments]
        * [privateKey]
        * from
        * [to]
        * [value]
        * [gas]
        * [gasPrice]
        * [data]
        * [none]
* Methods
    * generate([currency]): Object
    * import(key [, type] [, currency]): Object
        * type: 'privateKey', 'keystore', 'mnemonicPhrase', 'readonly'
        * key: string
        * currency: string
    * setProvider(host)
    * getBalance(addressHexString): Promise
    * getTokenBalance(addressHexString, contractAddress): Promise
    * getTransaction(transactionHash): Promise
    * contract(abi, address): Object
    * sendTransaction(transactionObject): Promise

### eth-util
* toWei(num, unit)
* fromWei(num, unit)
* toBuffer
* decodeAbi
* encodeAbi
* signTransaction