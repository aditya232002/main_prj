var phaseEnum; 

App = {
  web3Provider: null,
  contracts: {},
  contract:{},
  account: "0xe23074E96c5F40aDb08A5d4aB9a27BCd3401401b",

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        App.account = accounts[0];
      } catch (error) {
        if (error.code === 4001) {
    
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
    var contractAddress = "0x80af0a186C03d4c35343181AE0DeDd4D2CD7316e"; 

    const web3 = new Web3(window.ethereum);
    App.web3 = web3;
   
    console.log(App.account);
     App.contracts.Contest = new web3.eth.Contract(contractABI, contractAddress);

    return App.render();
  },

  render: function() {
    var contestInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();
    $("#after").hide();
    App.contracts.Contest.methods
      .contestantsCount()
      .call()
      .then(function(contestantsCount) {});

   
    App.contracts.Contest.methods
      .contestantsCount()
      .call()
      .then(function(contestantsCount) {
        console.log(contestantsCount);
        var contestantsResults = $("#test");
        contestantsResults.empty();
        var contestantsResultsAdmin = $("#contestantsResultsAdmin");
        contestantsResultsAdmin.empty();
        var contestantSelect = $("#contestantSelect");
        contestantSelect.empty();

        var contestants = [];
        for (var i = 1; i <= contestantsCount; i++) {
          contestants.push(App.contracts.Contest.methods.contestants(i).call());
        }

        Promise.all(contestants)
          .then(function(contestantData) {
            contestantData.forEach(function (contestant) {
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
            });
          })
          .then(function() {
            loader.hide();
            content.show();
          });
      })
      .catch(function(error) {
        console.warn(error);
      });

   
    App.contracts.Contest.methods
      .state()
      .call()
      .then(function(state) {
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
      })
      .catch(function(err) {
        console.error(err);
      });

   
    App.contracts.Contest.methods
      .state()
      .call()
      .then(function(state) {
        var result = $('#Results');
        if (state == 2) {
          $("#not").hide();
          App.contracts.Contest.methods.contestantsCount().call().then(function(contestantsCount) {
            var contestants = [];
            for (var i = 1; i <= contestantsCount; i++) {
              contestants.push(App.contracts.Contest.methods.contestants(i).call());
            }
            Promise.all(contestants).then(function (contestantData) {
              contestantData.forEach(function (contestant) {
                var id = contestant[0];
                var name = contestant[1];
                var voteCount = contestant[2];
                var fetchedParty = contestant[3];
                var fetchedAge = contestant[4];
                var fetchedQualification = contestant[5];

                var resultTemplate = `<tr><th>${id}</th><td>${name}</td><td>${fetchedAge}</td><td>${fetchedParty}</td><td>${fetchedQualification}</td><td>${voteCount}</td></tr>`;
                result.append(resultTemplate);
              });
            });
          });
        } else {
          $("#renderTable").hide();
        }
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  castVote: async function(id) {
    var contestantId = id;
    const nonce = await App.web3.eth.getTransactionCount(App.account, 'latest');
    App.contracts.Contest.methods
      .vote(contestantId)
      .send({ from: App.account,  gas: 3000000,gasPrice: '10000000000' })
      .then(function(result) {
    
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  addCandidate: async function() {
    $("#loader").hide();
    var name = $('#name').val();
    var age = $('#age').val();
    var party = $('#party').val();
    var qualification = $('#qualification').val();
    const nonce = await App.web3.eth.getTransactionCount(App.account, 'latest');
    App.contracts.Contest.methods
      .addContestant(name, party, age, qualification)
      .send({ from: App.account,  gas: "3000000",gasPrice: '10000000000', nonce: nonce})
      .on('error', function(error){ console.log(error) })
      .on('transactionHash', function(transactionHash){console.log(transactionHash) })
      .on('receipt', function(receipt){
          console.log(receipt.contractAddress) 
            })
      .on('confirmation', function(confirmationNumber, receipt){ })
      .then(function(result) {
        $("#loader").show();
        $('#name').val('');
        $('#age').val('');
        $('#party').val('');
        $('#qualification').val('');
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  changeState: async function() {
    phaseEnum++;
    const nonce = await App.web3.eth.getTransactionCount(App.account, 'latest');
    App.contracts.Contest.methods
      .changeState(phaseEnum)
      .send({ from: App.account,  gas: 3000000,gasPrice: '10000000000',nonce: nonce })
      .then(function(result) {
        $("#content").hide();
        $("#loader").show();
      })
      .catch(function(err) {
        console.error(err);
      });
  },

  registerVoter: async function(address) {
    const nonce = await App.web3.eth.getTransactionCount(App.account, 'latest');
    App.contracts.Contest.methods
      .voterRegisteration(address)
      .send({ from: App.account,  gas: 3000000,gasPrice: '10000000000',nonce: nonce })
      .then(function(result) {
        $("#content").hide();
        $("#loader").show();
      })
      .catch(function(err) {
        console.error(err);
      });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
