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

  // Use our contract to retrieve art
  return App.listArt();
});

  return App.bindEvents();
},

bindEvents: function() {
  $(document).on('click', '.btn-buy', App.handleConvert);
},

listArt: function(art_list){
  var artRow = $('#artRow');
  artRow.empty();
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
            console.log(fetched_art[5].toNumber());
            var artRow = $('#artRow');
            var artTemplate = $('#artTemplate');
            artTemplate.find('.panel-title').text(fetched_art[1]);
            artTemplate.find('.art-desc').text(fetched_art[2]);
            artTemplate.find('.art-image').attr('href',fetched_art[3]);
            artTemplate.find('.art-price').text(fetched_art[5].toNumber());
            artTemplate.find('.art-owner').text(fetched_art[4]);
            artTemplate.find('.art-artist').text(fetched_art[6]);
            artTemplate.find('.btn-buy').attr('data-id', fetched_art[0].c[0]);
            artTemplate.find('.btn-buy').attr('data-price', fetched_art[5].toNumber());
            if (fetched_art[7] == false) {
              artTemplate.find('.btn-buy').attr('disabled', true);
            }
            else{
              artTemplate.find('.btn-buy').attr('disabled', false);
            }
            artRow.append(artTemplate.html());
          }
        });
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  });
},

handleConvert: function(event) {
  event.preventDefault();

  var artId = parseInt($(event.target).data('id'));
  var price = parseInt($(event.target).data('price'));  
  console.log(price);
  var CollectiblesInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Collectibles.deployed().then(function(instance) {
      CollectiblesInstance = instance;

    // Execute buy as a transaction by sending account
    return CollectiblesInstance.buy_art.sendTransaction(artId, {from: account, value:price});
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
