import Util from '../src/lib/eth/eth-util';

describe('util', () => {
    test('toWei', () => {
        let wei = Util.toWei(Util.toBigNumber(111));
        console.log(typeof wei);
        console.log('toWei:', wei);
        // Util.toWei();
    });

    test('fromWei', () => {
        let eth = Util.fromWei('1', 'ether');
        console.log('ether:', eth);

        expect(eth).toBe('0.000000000000000001');
    });

    test('toBigNumber', () => {
        let bn = Util.toBigNumber(1);

        console.log('big number:', bn);
        //console.log(bn.isEqualTo(1));
    });

    test('toBuffer', () => {
        let buffer = Util.toBuffer('abc');
        console.log('buffer: ', buffer);
    });

    test('toHex', () => {
        let hex = Util.toHex('abc');
        console.log('hex: ', hex);

        expect(hex).toBe('0x616263');
    });

    test('verifyPrivateKey', () => {
        let isPrivateKey = Util.verifyPrivateKey('0x246fa9a22eb6a99426c1255309a3e88aed5850294803c2e1df585a246d690d2153ba7b7d55616e953d3c7b60c686b2b418aa6de5fad5f1e1448ee1870cd67e6a');

        console.log(isPrivateKey);
        //expect(isPrivateKey).toBe(true);
    });

    test('encodeAbi', () => {
        let encode = Util.encodeAbi('baz', ['uint32', 'bool'], ['69', true]);
        console.log('abi encoding: ', encode);

        // https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
        let exp = '0xcdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001';
        expect(encode).toBe(exp);
    });

    test('decodeAbi', () => {
        let decode = Util.decodeAbi(['address'], '0x0000000000000000000000000005b7d915458ef540ade6068dfe2f44e8fa733c');
        
        console.log('return decode: ', decode);
        expect(decode).toBe('0005b7d915458ef540ade6068dfe2f44e8fa733c');
    });

    test('signTransaction', () => {
        let sign = Util.signTransaction({
            from: '0x3228f93390612218a7d55503a3bdd46c4fbd1fd3',
            to: '0xb02d5da39628918daa9545388f1abb60be368e0a',
            value: 1
        }, '0x229d31ddcf8f16d215dfa5b8e760b8775b7088a1311391e1ecbad251a9f2de65');

        console.log('sign: ', sign);
    })
});