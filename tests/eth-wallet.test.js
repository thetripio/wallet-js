import EthWallet from '../src/lib/eth/eth-wallet';
import ethUtil from 'ethereumjs-util';
import secp256k1 from 'secp256k1';
import eip20 from '../src/lib/eth/eth-eip-20';
import roomnight from './abis/tripio-roomnight';

const wallet = new EthWallet();
wallet.setProvider('http://192.168.1.41:8545', 1000);
// wallet.setProvider('https://rinkeby.infura.io', 1000);
// http://35.200.87.13:8545

// describe('generate wallet', () => {
//     wallet.generate();
//     let privateKeyBuffer = ethUtil.toBuffer(wallet.privateKey);

//     test('privateKey must be 32bit', () => {
//         expect(32).toBe(privateKeyBuffer.length);
//     });

//     test('verify privateKey', () => {
//         expect(true).toBe(secp256k1.privateKeyVerify(privateKeyBuffer));
//     });
// });

describe('import wallet', () => {
    wallet.import('0x229d31ddcf8f16d215dfa5b8e760b8775b7088a1311391e1ecbad251a9f2de65')

    test('publicKey', () => {
        expect('0x246fa9a22eb6a99426c1255309a3e88aed5850294803c2e1df585a246d690d2153ba7b7d55616e953d3c7b60c686b2b418aa6de5fad5f1e1448ee1870cd67e6a').toBe(wallet.publicKey);
    });

    test('address', () => {
        expect('0x3228f93390612218a7d55503a3bdd46c4fbd1fd3').toBe(wallet.address);
    });
});

describe('transaction', () => {
    test('getBalance', async () => {
        let balance = await wallet.getBalance('0x3228f93390612218a7d55503a3bdd46c4fbd1fd3');

        console.log('balance:', balance.toNumber());
        expect(balance.toNumber()).not.toBe(0);
       
    }, 30000);

    test('getTokenBalance', async () => {
        let balance = await wallet.getTokenBalance('0x3228f93390612218a7d55503a3bdd46c4fbd1fd3', '0xd68c8a6efec16180f4989dfb683d48dfd2b0ed7d');

        console.log('token:', balance.toNumber());
        expect(balance.toNumber()).not.toBe(0);
    }, 30000);

    test('getTransaction', async () => {
        let tx = await wallet.getTransaction('0x15bedb614812a187fa0128e7473d64c106f8c9dc1e71fbb72422df4fc49840b4')

        expect('0x15bedb614812a187fa0128e7473d64c106f8c9dc1e71fbb72422df4fc49840b4').toBe(tx.hash);
    }, 30000);

    test('sendTransaction contract', async () => {

        let contract = wallet.contract(eip20, '0xd68c8a6efec16180f4989dfb683d48dfd2b0ed7d');

        let tx = await wallet.sendTransaction({
            from: '0xb02d5da39628918daa9545388f1abb60be368e0a',
            contract: contract,
            methodName: 'balanceOf',
            arguments: ['0xb02d5da39628918daa9545388f1abb60be368e0a'],
            //to: '0xb02d5da39628918daa9545388f1abb60be368e0a',
            //value: 1, // unit wei
            //gas: 1,
            //gasPrice: 1,
            //data: '',
            nonce: null
        });
        
        console.log('balanceOf:', tx);
        expect(tx).not.toBe(0);

    }, 30000);

    test('estimateGas', async () => {
        let gas = await wallet.estimateGas({
            from: '0x3228f93390612218a7d55503a3bdd46c4fbd1fd3',
            to: '0xb02d5da39628918daa9545388f1abb60be368e0a'
        });

        console.log('Gas Limit:', gas);
        expect(gas).toBe(21000);
    });

    test('gasPrice', async () => {
        let gasPrice = await wallet.gasPrice();

        console.log('Gas Price:', gasPrice.toString());
        expect(gasPrice).not.toBe(0);
    });

    // test('sendTransaction', async () => {
        
    //     let tx = await wallet.sendTransaction({
    //         from: '0x3228f93390612218a7d55503a3bdd46c4fbd1fd3',
    //         to: '0xb02d5da39628918daa9545388f1abb60be368e0a',
    //         value: 1000000000000000000,
    //         gasLimit: 22000,
    //         gasPrice: 1000000000,
    //         //data: '',
    //         //nonce: 12,
    //         privateKey: '0x229d31ddcf8f16d215dfa5b8e760b8775b7088a1311391e1ecbad251a9f2de65'
    //     });

    //     console.log(tx);
    // });

 });

