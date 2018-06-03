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

### Attributes
* privateKey
* publicKey
* address
* currency

### Methods
* generate([currency]): Wallet
* import(key [, type] [, currency]): Wallet
    * type: 'privateKey', 'keystore', 'mnemonicPhrase', 'readonly'
    * key: string
    * currency: string
* setProvider(host)
* getBalance(addressHexString): Promise
* getTokenBalance(addressHexString, contractAddress): Promise
* getTransaction(transactionHash): Promise
* sendTransaction(transactionObject): Promise
* _encodeAbi(methodName, paramsName[], paramsValue[]): string
* _signTx(transactionObject): string