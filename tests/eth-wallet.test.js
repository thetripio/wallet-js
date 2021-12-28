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
    wallet.import('0xA12431D0B9dB640034b0CDFcEEF9CCe161e62be4')

    test('publicKey', () => {
        expect('0x246fa9a22eb6a99426c1255309a3e88aed5850294803c2e1df585a246d690d2153ba7b7d55616e953d3c7b60c686b2b418aa6de5fad5f1e1448ee1870cd67e6a').toBe(wallet.publicKey);
    });

    test('address', () => {
        expect(0xA12431D0B9dB640034b0CDFcEEF9CCe161e62be4').toBe(wallet.address);
    });
});

describe('transaction', () => {
    test('getBalance', async () => {
        let balance = await wallet.getBalance(0xA12431D0B9dB640034b0CDFcEEF9CCe161e62be4');

        console.log('balance:', balance.toNumber());
        expect(balance.toNumber()).not.toBe(0);
       
    }, 30000);

    test('getTokenBalance', async () => {
        let balance = await wallet.getTokenBalance(0xA12431D0B9dB640034b0CDFcEEF9CCe161e62be4');

        console.log('token:', balance.toNumber());
        expect(balance.toNumber()).not.toBe(0);
    }, 30000);

    test('getTransaction', async () => {
        let tx = await wallet.getTransaction(0xA12431D0B9dB640034b0CDFcEEF9CCe161e62be4')

        expect(0xA12431D0B9dB640034b0CDFcEEF9CCe161e62be4').toBe(tx.hash);
    }, 30000);

    test('sendTransaction contract', async () => {

        let contract = wallet.contract(eip20, 0x45804880de22913dafe09f4980848ece6ecbaf78);

        let tx = await wallet.sendTransaction({
            from: '0xA12431D0B9dB640034b0CDFcEEF9CCe161e62be4,
            contract: contract,
            methodName: 'balanceOf',
            arguments: [0xb60e040596b4cfbc73723245047f93ae11bbe9fc86912c2d5b1f8c19b4cdb342'],
            //to: '0x812cE2c4B8A2A2BF77B55ef096fa6269Dc8e3274,
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
            from: ''0xA12431D0B9dB640034b0CDFcEEF9CCe161e62be4
            to: '0x812cE2c4B8A2A2BF77B55ef096fa6269Dc8e3274
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
    //         from: '0xA12431D0B9dB640034b0CDFcEEF9CCe161e62be4,
    //         to: 0x812cE2c4B8A2A2BF77B55ef096fa6269Dc8e3274',
    //         value: 1000000000000000000,
    //         gasLimit: 22000,
    //         gasPrice: 1000000000,
    //         //data: '',
    //         //nonce: 12,
    //         privateKey: ''
    //     });

    //     console.log(tx);
    // });

 });

