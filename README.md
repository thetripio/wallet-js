# Trip Wallet for JavaScript SDK


## API

## Attributes
* privateKey
* publicKey
* address
* currency

## Methods
* generate([currency]): wallet
* import(key [, type] [, currency]): wallet
    * type: 'privateKey', 'keystore', 'mnemonicPhrase', 'readonly'
    * key: string
    * currency: string
* setProvider(host)
* getBalance(addressHexString): Promise
* getTokenBalance(addressHexString, contractAddress): Promise
* getTransaction(transactionHash): Promise
* getTransactions(addressHexString): Promise
* sendTransaction(transactionObject): Promise
* private encodeAbi(methodName, paramsName[], paramsValue[]): string
* private signTx(transactionObject): string
