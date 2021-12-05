const KTMCoin = artifacts.require("KTMCoin");

contract('KTMCoin', function(accounts) {

    it('has proper markdown information for the public', async function() {
        const tokenInstance = await KTMCoin.deployed();

        const about = await tokenInstance.about();

        assert.notEqual(about, 0x0);

        //about 

        //contact
    });

    it('initializes ktm coin with correct values', function() {
        return KTMCoin.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, 'KTM Coin');
            return tokenInstance.symbol();
        }).then(function(symbol) {
        assert.equal(symbol, 'KTMC');
        return tokenInstance.standard();
    }).then(function(standard) {
            assert.equal(standard, 'KTM Coin Version 1.0');
        })
    });   

    it('set the total supply upon deployment', function() {
        return KTMCoin.deployed().then(function(instance) {
            tokenInsance = instance;
            return tokenInsance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 10000, 'sets the initial total supply of gurkha coins');
            return tokenInsance.balanceof(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 10000, 'it sets the initial balance to account admin balance')
        })
    })

    it('transfers token ownership successfully', async function() {
        const tokenInstance = await  KTMCoin.deployed();
        const exceededAmount = 999999;
        const viableAmount = 2500;
        //transfer fails if not enough balance
        try {
            await tokenInstance.transfer.call(accounts[1], exceededAmount);
        }catch(err) {
            assert(err.message.indexOf('revert') >= 0, 'revert error if balance not sufficient');
        }

        // returns true on transfer event
        var success = await tokenInstance.transfer.call(accounts[1], viableAmount, {
            from: accounts[0]
        });
        assert.equal(success, true);

        // actual transfer event 
        var receipt = await tokenInstance.transfer(accounts[1], viableAmount, {
            from: accounts[0]
        });
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be the transfer event');
        assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the coin is transferred from');
        assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the coin is transferred to');
        assert.equal(receipt.logs[0].args.value, viableAmount, 'logs the transferred value');

        const fromBalance = await tokenInstance.balanceof(accounts[0]);
        const toBalance = await tokenInstance.balanceof(accounts[1]);

        assert.equal(fromBalance.toNumber(), 7500);
        assert.equal(toBalance.toNumber(), viableAmount);
    })

    it('approves the coins for delegated transfer', async function() {
        const tokenInstance = await KTMCoin.deployed();

        var success = await tokenInstance.approve.call(accounts[1], 100);
        assert.equal(success, true, 'it returns true');
        
        var receipt = await tokenInstance.approve(accounts[1], 100, {from : accounts[0]});
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Approval', 'should be the approval event');
        assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the owner');
        assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the spender');
        assert.equal(receipt.logs[0].args.value, 100, 'logs the transferred value');

        var allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
        assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
    });

    it('handles delegated token transfers', async function() {
        const tokenInstance = await KTMCoin.deployed();

        var fromAccount = accounts[2];
        var toAccount = accounts[3];
        var spendingAccount = accounts[4];

        // Transfer some tokens to fromAccount 

        var receipt = await tokenInstance.transfer(fromAccount, 100, { from: accounts[0]});

        // Approve spending account to spend 10 coins from fromAccount

        var spendReceipt = await tokenInstance.approve(spendingAccount, 10, { from: fromAccount});

        // Try tranfer something larger than the senders balance
        try {
            await tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount});
        }catch(err) {
            assert(err.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
        }

        // try transfer larger than the approved amount
         try {
            await tokenInstance.transferFrom(fromAccount, toAccount, 20, {
                 from: spendingAccount
             });
         }catch(err) {
            assert(err.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved');
         }


        var success = await tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {
                 from: spendingAccount
             });

        assert.equal(success, true);

        var receipt = await tokenInstance.transferFrom(fromAccount, toAccount, 10, {
            from: spendingAccount
        });
        // console.log('what is ', receipt.logs[0]);
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be the transfer event');
        assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the owner');
        assert.equal(receipt.logs[0].args._to, toAccount, 'logs the spender');
        assert.equal(receipt.logs[0].args.value, 10, 'logs the transferred value');

        var from_balance = await tokenInstance.balanceof(fromAccount);
        var to_balance = await tokenInstance.balanceof(toAccount);
        var allowance_value = await tokenInstance.allowance(fromAccount, spendingAccount);
        assert.equal(from_balance.toNumber(), 90, 'deducts the amount from the sending account');
        assert.equal(to_balance.toNumber(), 10, 'deducts the amount from the receiving acco unt');
        assert.equal(allowance_value.toNumber(), 0, 'deducts the amount from the allowance');
    })
})