import Web3 from 'web3';
import EthUtil from 'ethereumjs-util';
import Transaction from 'ethereumjs-tx';
import Abi from 'ethereumjs-abi';
import Secp256k1 from 'secp256k1';

let web3 = new Web3();

/**
 * EthUtil
 * @module EthUtil
 */
export default {
    toWei: (num, unit) => {
        return web3.toWei(num, unit);
    },
    fromWei: (num, unit) => {
        return web3.fromWei(num, unit);
    },
    toBigNumber: (value) => {
        return web3.toBigNumber(value);
    },
    toBuffer: (any) => {
        return EthUtil.toBuffer(any);
    },
    fromBuffer: () => {

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
    },
    verifyPrivateKey: (privateKey) => {
        let pk = EthUtil.toBuffer(privateKey);

        return pk.length == 32 && Secp256k1.privateKeyVerify(pk)
    }
}