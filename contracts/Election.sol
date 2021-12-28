pragma solidity 0.5.16;
contract Election
{
	struct Candidate{
		uint id;
		string name;
		uint voteCount;
	}

	constructor() public {
		AddCandidate("Saurav");
		AddCandidate("Akash");
		AddCandidate("Ankit");
	}

	mapping(uint=>Candidate) public candidates;
	mapping(address=>bool) public voters;
	uint public candidatesCount;

	//event  votedEvent (
	//	uint indexed _candidateId
	//	);
	function AddCandidate(string memory _name) private {
		candidatesCount++;
		candidates[candidatesCount] = Candidate(candidatesCount,_name,0);
	
	}
	function vote(uint _candidateId) public{

		//a voter has not voted before
		require(!voters[msg.sender]);
		require(_candidateId > 0 && _candidateId <= candidatesCount);		
		
		voters[msg.sender] = true;

		candidates[_candidateId].voteCount++;
		//votedEvent(_candidateId);
	}
}