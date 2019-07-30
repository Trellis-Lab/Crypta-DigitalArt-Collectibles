//const ipfs = window.IpfsHttpClient('localhost', '5001')

App = {
  web3Provider: null,
  contracts: {},


  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access");
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
}
web3 = new Web3(App.web3Provider);


web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];
  $('#user-address').text(account);
});

return App.initContract();
},

initContract: function(data) {

  $.getJSON('./Collectibles.json', function(data) {
  // Get the necessary contract artifact file and instantiate it with truffle-contract
  var CollectiblesArtifact = data;
  App.contracts.Collectibles = TruffleContract(CollectiblesArtifact);

  // Set the provider for our contract
  App.contracts.Collectibles.setProvider(App.web3Provider);

  // Use our contract to retrieve and mark the adopted pets
  return App.listArt();
});

  return App.bindEvents();
},

bindEvents: function() {
  $(document).on('click', '.btn-adopt', App.handleAdopt);
},

listArt: function(art_list){
  var petsRow = $('#petsRow');
  petsRow.empty();
  var collectiblesinstance;

  App.contracts.Collectibles.deployed().then(function(instance) {
    collectiblesinstance = instance;

    return collectiblesinstance.getartlength.call();
  }).then(function(art_count) {

    var collectiblesinstance;
    App.contracts.Collectibles.deployed().then(function(instance) {
      collectiblesinstance = instance;

      for (i = 0; i < art_count; i++) {
        collectiblesinstance.getArt.call(i).then(function(fetched_art){
          if (fetched_art !== '0x0000000000000000000000000000000000000000') {
            console.log(fetched_art);
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');
            $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
            petTemplate.find('.panel-title').text(fetched_art[1]);
            petTemplate.find('.art-desc').text(fetched_art[2]);
            petTemplate.find('.art-image').attr('href',fetched_art[3]);
            petTemplate.find('.art-price').text(fetched_art[5].c[0]);
            petTemplate.find('.art-owner').text(fetched_art[4]);
            petTemplate.find('.art-artist').text(fetched_art[6]);
            petTemplate.find('.btn-adopt').attr('data-id', fetched_art[0].c[0]);
            petTemplate.find('.btn-adopt').attr('data-price', fetched_art[5].c[0]);
            if (fetched_art[7] == false) {
              petTemplate.find('.btn-adopt').attr('disabled', true);
            }
            else{
              petTemplate.find('.btn-adopt').attr('disabled', false);
            }
            petsRow.append(petTemplate.html());
          }
        });
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  });
},

markAdopted: function(art_list, account) {

  var collectiblesinstance;

  App.contracts.Collectibles.deployed().then(function(instance) {
    collectiblesinstance = instance;

    return true;
  }).then(function(art_count) {
    for (i = 0; i < art_count; i++) {
      if (art_list[i] !== '0x0000000000000000000000000000000000000000') {
        $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
      }
    }
  }).catch(function(err) {
    console.log(err.message);
  });

},

handleAdopt: function(event) {
  event.preventDefault();

  var petId = parseInt($(event.target).data('id'));
  var price = parseInt($(event.target).data('price'));
  console.log(petId);
  console.log(price);
  var CollectiblesInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Collectibles.deployed().then(function(instance) {
      CollectiblesInstance = instance;

    // Execute adopt as a transaction by sending account
    return CollectiblesInstance.buy_art.sendTransaction(petId, {from: account, value:price});
  }).then(function(result) {
    return App.listArt();
  }).catch(function(err) {
    console.log(err.message);
  });
});

}

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
