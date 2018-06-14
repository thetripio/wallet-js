import EthWallet from '../src/lib/eth/eth-wallet';
import ethUtil from 'ethereumjs-util';
import secp256k1 from 'secp256k1';
import eip20 from '../src/lib/eth/eth-eip-20';

const wallet = new EthWallet();
wallet.setProvider('http://192.168.1.41:8545', 1000);
// wallet.setProvider('https://rinkeby.infura.io', 1000);
// http://35.200.87.13:8545

describe('generate wallet', () => {
    wallet.generate();
    console.log(wallet);
    let privateKeyBuffer = ethUtil.toBuffer(wallet.privateKey);

    test('privateKey must be 32bit', () => {
        expect(32).toBe(privateKeyBuffer.length);
    });

    test('verify privateKey', () => {
        expect(true).toBe(secp256k1.privateKeyVerify(privateKeyBuffer));
    });
});

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

        console.log(balance.toNumber());
       
    }, 30000);

    test('getTokenBalance', async () => {
        let balance = await wallet.getTokenBalance('0x3228f93390612218a7d55503a3bdd46c4fbd1fd3', '0xF142f1c7BaDc95FB438302D7Cf0a5Db426f8f779');

        console.log(balance.toNumber());

    }, 30000);

    test('getTransaction', async () => {
        let tx = await wallet.getTransaction('0x15bedb614812a187fa0128e7473d64c106f8c9dc1e71fbb72422df4fc49840b4')

        console.log(tx);
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
        console.log('tx');
        console.log(tx);

    }, 30000);

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

// describe('main transaction', () => {
//      wallet.setProvider('https://mainnet.infura.io/9WfBzi6QFGrAWBYZKq57');
//     //wallet.setProvider('http://35.200.87.13:8545');

//     test('getBalance', async () => {
//         let balance = await wallet.getBalance('0xb02d5da39628918daa9545388f1abb60be368e0a');

//         console.log(balance.toNumber());
//     }, 10000);

//     test('getTokenBalance', async () => {
//         let balance = await wallet.getTokenBalance('0xb02d5da39628918daa9545388f1abb60be368e0a', '0x8b40761142b9aa6dc8964e61d0585995425c3d94')

//         console.log(balance.toNumber());
//     }, 10000);

//     test('getTransaction', async () => {
//         let tx = await wallet.getTransaction('0xec3caf5731d6b9724ff5278bd9482bfeb58e3d1f44b199c7ce99b4e07def83cf');

//         expect('0xec3caf5731d6b9724ff5278bd9482bfeb58e3d1f44b199c7ce99b4e07def83cf').toBe(tx.hash);
//         expect('0xb02d5da39628918daa9545388f1abb60be368e0a').toBe(tx.from);
//     }, 10000);
    
// });

