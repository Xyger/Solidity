var Election = artifacts.require("./Election.sol");

contract("Election",function(accounts){
	var ElectionInstance;
	it("two candidates present",function(){
		return Election.deployed().then(function(instance){
			return instance.candidatesCount();
		}).then(function(count){
			assert.equal(count,3);
		});
	 });
	it("correct vote counts",function(){
		return Election.deployed().then(function(instance){
			ElectionInstance = instance;
			return ElectionInstance.candidates(1);
		}).then(function(candidate){
			assert.equal(candidate[0],1,"correct ID");
			assert.equal(candidate[1],"Saurav","name");
			assert.equal(candidate[2],0,"correct vote count");
			return ElectionInstance.candidates(2);
		}).then(function(candidate){
			assert.equal(candidate[0],2,"correct ID");
			assert.equal(candidate[1],"Akash","name");
			assert.equal(candidate[2],0,"correct vote count");
		});
	});
	it("The vote has been counted",function(){
		return Election.deployed().then(function(ins){
			ElectionInstance = ins;
			candidateId = 1;
			return ElectionInstance.vote(candidateId,{ from : accounts[0]});
		}).then(function(receipt){

			return ElectionInstance.voters(accounts[0]);
		}).then(function(voted){
			assert(voted,"The voter has been marked");
			return ElectionInstance.candidates(candidateId);
		}).then(function(candidate){
			var count = candidate[2];
			assert.equal(count,1,"the candidates vote count is increased by 1");
		});
	});
	it("No invalid voting",function(){
		return Election.deployed().then(function(instance){
			ElectionInstance = instance;
			return ElectionInstance.vote(99,{from : accounts[0]});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf("revert")>=0,"error must contain revert string");
			return ElectionInstance.candidates(1);
		}).then(function(candidate1){
			var Votecount = candidate1[2];
			assert.equal(Votecount,1);
			return ElectionInstance.candidates(2);
		}).then(function(candidate2){
			var Votecount = candidate2[2];
			assert.equal(Votecount,0);
		});

	});
	it("no double voting",function(){
		return Election.deployed().then(function(ins){
			ElectionInstance = ins;
			//candidateId = 2;
			ElectionInstance.vote(2,{ from : accounts[5]});
			return ElectionInstance.candidates(2);
		}).then(function(candidate2){
			var Votecount = candidate2[2];
			assert.equal(Votecount,1,"accepts first vote");
			//candidateId=2;
			return ElectionInstance.vote(3,{ from : accounts[5] });
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf("revert") >= 0,"message must contain revert string");
			return ElectionInstance.candidates(1);
		}).then(function(can1){
			var Votecount = can1[2];
			assert.equal(Votecount,1,"candidate1 did not receive any votes");
			return ElectionInstance.candidates(2);
		}).then(function(can2){
			var Votecount = can2[2];
			assert.equal(Votecount,1,"candidate2 didn't receive any votes");
			return ElectionInstance.candidates(3);
		}).then(function(can3){
			var Votecount=can3[2];
			assert.equal(Votecount,0,"candidate3 no votes");
		});
	});
});
