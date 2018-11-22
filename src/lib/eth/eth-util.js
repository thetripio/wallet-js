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
    toBigNumber: (value) => {
        return web3.toBigNumber(value);
    },
    /**
     * convert string to buffer
     * @param { String }
     * @returns { Object }
     */
    toBuffer: (any) => {
        return EthUtil.toBuffer(any);
    },
    /**
     * convert string to hex
     */
    toHex: (any) => {
        return web3.toHex(any);
    },
    fromHex: () => {

    },
    /**
     * verify private key
     * @param { String } privateKey
     * @returns { Boolean }
     */
    verifyPrivateKey: (privateKey) => {
        let pk = EthUtil.toBuffer(privateKey);

        return pk.length == 32 && Secp256k1.privateKeyVerify(pk)
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
    decodeAbi: (types, data, returnType) => {
        let decoded = Abi.rawDecode(types, EthUtil.toBuffer(data));

        if(returnType == 'array') {
            return decoded;
        }

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
}