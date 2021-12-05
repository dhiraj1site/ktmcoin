pragma solidity >=0.4.22 <0.9.0;

contract KTMCoin {
    uint256 public totalSupply;
    string public name = 'KTM Coin';
    string public symbol = 'KTMC';
    string public standard = 'KTM Coin Version 1.0';

    string public about = 'KTM COIn';
    
    
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender, 
        uint256 value
    );

    //transfer

    mapping(address => uint256) public balanceof;

    //allowance
    mapping(address => mapping(address => uint256)) public allowance;

    constructor (uint256 _initialSupply) {
        balanceof[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }


    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Throw exception if acccount doesnt have enough coins
        require(balanceof[msg.sender] >= _value);

        //Transfer the balance
        balanceof[msg.sender] -= _value;
        balanceof[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceof[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceof[_from]  -= _value;
        balanceof[_to]  += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }

    // Set the total number of coins

    // Read the total number of coins
}