var Election = artifacts.require("./Elections.sol");

contract("Election", function(accounts) {
	var electionInstance;
	it("initializes with two candidates", function(){
		return  Election.deployed().then(function(instance){
			return instance.Num_candidates(); 
		}).then(function(count){
			assert.equal(count,2);
		});
	});
	it("initialise with correct values",function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.candidates(1);
		}).then(function(candidate) {
			assert.equal(candidate[0],1,"correct ID");
			assert.equal(candidate[1],"Saurav","correct name");
			assert.equal(candidate[2],0,"correct vote count");
			return electionInstance.candidates(2);
		}).then(function(candidate){
			assert.equal(candidate[0],2,"correct ID");
			assert.equal(candidate[1],"Akash","correct name");
			assert.equal(candidate[2],0,"correct vote count");
		});
	});
});
