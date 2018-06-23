import Wallet, {EthUtil} from "../src/index";

describe('create wallet', () => {
    
    let wallet = Wallet('eth');

    test('generate wallet', () => {
        expect('eth').toBe(wallet.currency);
        console.log(EthUtil.toWei('11'));
    });

});