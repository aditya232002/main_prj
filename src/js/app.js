var phaseEnum; 
App = {
  web3Provider: null,
  trnhash: "",
  contracts: {},
  contract:{},
  account: "0xe23074E96c5F40aDb08A5d4aB9a27BCd3401401b",

  init: async function() {
    return await App.initEthers();
  },

  initEthers: async function() {
    if (window.ethereum) {
      try {
        await window.ethereum.enable(); 
        
        App.account = window.ethereum.selectedAddress; 
      } catch (error) {
        if (error.code === 4001) {
          console.log('Error occur')
        }
      }
    }
    return App.initContract();
},

  initContract: function() {
    
    var contractABI = [
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "contestants",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "party",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "age",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "qualification",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "contestantsCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "state",
        "outputs": [
          {
            "internalType": "enum Contest.PHASE",
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "voters",
        "outputs": [
          {
            "internalType": "bool",
            "name": "hasVoted",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "vote",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isRegistered",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "enum Contest.PHASE",
            "name": "x",
            "type": "uint8"
          }
        ],
        "name": "changeState",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_party",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_age",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_qualification",
            "type": "string"
          }
        ],
        "name": "addContestant",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "voterRegisteration",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_contestantId",
            "type": "uint256"
          }
        ],
        "name": "vote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]; 
    var contractAddress = "0x4bA60C152B62E45f718C01e53CD97300c7EFB49C"; //Here is the contract address we have to change it when we redeploying it..

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    App.contracts.Contest = new ethers.Contract(contractAddress, contractABI, signer);
    
    return App.render();
  },

  render: async function() {
    var contestInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();
    $("#after").hide();
  
    var contestantsCount = await App.contracts.Contest.contestantsCount();
    var contestantsResults = $("#test");
    contestantsResults.empty();
    var contestantsResultsAdmin = $("#contestantsResultsAdmin");
    contestantsResultsAdmin.empty();
    var contestantSelect = $("#contestantSelect");
    contestantSelect.empty();
  
    var contestants = [];
    for (var i = 1; i <= contestantsCount; i++) {
      contestants.push(await App.contracts.Contest.contestants(i));
    }
  
    for (var j = 0; j < contestants.length; j++) {
      var contestant = contestants[j];
      var id = contestant[0];
      var name = contestant[1];
      var voteCount = contestant[2];
      var fetchedParty = contestant[3];
      var fetchedAge = contestant[4];
      var fetchedQualification = contestant[5];
  
      var contestantTemplate = `<div class='card' style='width: 15rem; margin: 1rem;'>
        <img class='card-img-top' src='../img/Sample_User_Icon.png' alt=''>
        <div class='card-body text-center'>
          <h4 class='card-title'>${name}</h4>
          <button type='button' class='btn btn-info' data-toggle='modal' data-target='#modal${id}'>Click Here to Vote</button>
          <div class='modal fade' id='modal${id}' tabindex='-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'>
            <div class='modal-dialog modal-dialog-centered' role='document'>
              <div class='modal-content'>
                <div class='modal-header'>
                  <h5 class='modal-title'> <b>${name}</b></h5>
                  <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                </div>
                <div class='modal-body'> <b> Party : ${fetchedParty}<br>Age : ${fetchedAge}<br>Qualification : ${fetchedQualification}<br></b></div>
                <div class='modal-footer'>
                  <button class='btn btn-info' onClick='App.castVote(${id})'>VOTE</button>
                  <button type='button' class='btn btn-info' data-dismiss='modal'>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  
      contestantsResults.append(contestantTemplate);
  
      var contestantOption = `<option style='padding: auto;' value='${id}'>${name}</option>`;
      contestantSelect.append(contestantOption);
  
      var contestantTemplateAdmin = `<tr><th>${id}</th><td>${name}</td><td>${fetchedAge}</td><td>${fetchedParty}</td><td>${fetchedQualification}</td><td>${voteCount}</td></tr>`;
      contestantsResultsAdmin.append(contestantTemplateAdmin);
    }
  
    loader.hide();
    content.show();
  
    var state = await App.contracts.Contest.state();
    var fetchedState;
    var fetchedStateAdmin;
    phaseEnum = state.toString();
    if (state == 0) {
      fetchedState = "Registration phase is on, go register yourself to vote !!";
      fetchedStateAdmin = "Registration";
    } else if (state == 1) { 
      fetchedState = "Voting is now live !!!";
      fetchedStateAdmin = "Voting";
    } else {
      fetchedState = "Voting is now over !!!";
      fetchedStateAdmin = "Election over";
    }

    var currentPhase = $("#currentPhase"); 
    currentPhase.empty();
    var currentPhaseAdmin = $("#currentPhaseAdmin"); 
    currentPhaseAdmin.empty();
    var phaseTemplate = `<h1>${fetchedState}</h1>`;
    var phaseTemplateAdmin = `<h3> Current Phase : ${fetchedStateAdmin}</h3>`;
    currentPhase.append(phaseTemplate);
    currentPhaseAdmin.append(phaseTemplateAdmin);

   //below is the Result page 
   
    if (state == 2) {
      $("#not").hide();
      var contestants = [];
      for (var i = 1; i <= contestantsCount; i++) {
        contestants.push(await App.contracts.Contest.contestants(i));
      }
      for (var j = 0; j < contestants.length; j++) {
        var contestant = contestants[j];
        var id = contestant[0];
        var name = contestant[1];
        var voteCount = contestant[2];
        var fetchedParty = contestant[3];
        var fetchedAge = contestant[4];
        var fetchedQualification = contestant[5];

        var resultTemplate = `<tr><th>${id}</th><td>${name}</td><td>${fetchedAge}</td><td>${fetchedParty}</td><td>${fetchedQualification}</td><td>${voteCount}</td></tr>`;
        result.append(resultTemplate);
      }
    } else {
      $("#renderTable").hide();
    }
  }
  ,


  castVote: async function(id) {
    var contestantId = id;
    console.log("id : ",id)
    await App.contracts.Contest.vote(contestantId, { from: App.account });
},

addCandidate: async function() {
    var name = $('#name').val();
    var age = $('#age').val();
    var party = $('#party').val();
    var qualification = $('#qualification').val();
    await App.contracts.Contest.addContestant(name, party, age, qualification, { from: App.account });
    $("#loader").show();
    $('#name').val('');
    $('#age').val('');
    $('#party').val('');
    $('#qualification').val('');
},

changeState: async function(phase) {
  const PHASE = {
    reg: 0,
    voting: 1,
    done: 2,
  };
  
  const adminInput = prompt('Enter a phase (reg, voting, done):');

  const phaseInput = adminInput.toLowerCase();
 
  if (PHASE.hasOwnProperty(phaseInput)) {
    alert(`The number for ${phaseInput} is ${PHASE[phaseInput]}`);
  } else {
    alert('You entered an invalid phase.');
  }

    await App.contracts.Contest.changeState(PHASE[phaseInput], { from: App.account });
},

voterRegisteration: async function(user) {

    var voterAddress = document.getElementById("accadd").value;
    console.log(voterAddress);
    await App.contracts.Contest.voterRegisteration(voterAddress, { from: App.account });
  
},
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});