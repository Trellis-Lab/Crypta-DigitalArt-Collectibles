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

  // Use our contract to retrieve list all art
  return App.listArt();
});

  return App.bindEvents();
},

bindEvents: function() {
  $(document).on('click', '.btn-buy', App.handleSwitchStatus);
  $(document).on('click', '#submit-art', App.createArt)
},

createArt: async function(event){
  event.preventDefault();
  var name = $('#name').val();
  var desc = $('#description').val();
  var image = $('#image_url').val();
  var price = parseInt($('#price').val());
  console.log(price);

  if (name == '' || desc == '' || image_url == '' || price == '') {
    alert('Cant leave enything empty');
    return null;
  }


  var images = document.getElementById('image_url');
  const file = images.files[0]
  
  const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', {protocol:'https'});
  await ipfs.add(file, (err, result) => {
    if(err) {
      console.error(err);
      return
    }
    var url = `https://ipfs.io/ipfs/${result[0].hash}`
    console.log(`Url --> ${url}`);
    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Collectibles.deployed().then(function(instance) {
        adoptionInstance = instance;

    // Execute adopt as a transaction by sending account
    console.log(price);
    return adoptionInstance.convert_art(name,desc,url,price, {from: account});
  }).then(function(result) {
    alert('Your Art has been decentralised');
    return App.listArt();
  }).catch(function(err) {
    console.log(err.message);
  });
});
  });

},

listArt: function(art_list){
  var artRow = $('#artRow');
  artRow.empty();
  var collectiblesinstance;

  App.contracts.Collectibles.deployed().then(function(instance) {
    collectiblesinstance = instance;
    var account = web3.eth.accounts[0];
    return collectiblesinstance.ownerArtsCount.call(account);
  }).then(function(arts) {
    console.log(arts);
    var collectiblesinstance;
    App.contracts.Collectibles.deployed().then(function(instance) {
      collectiblesinstance = instance;

      for (i = 0; i < arts.length; i++) {
        collectiblesinstance.getArt.call(arts[i]).then(function(fetched_art){
          if (fetched_art !== '0x0000000000000000000000000000000000000000') {
            var artRow = $('#artRow');
            var artTemplate = $('#artTemplate');
            artTemplate.find('.panel-title').text(fetched_art[1]);
            artTemplate.find('.art-desc').text(fetched_art[2]);
            artTemplate.find('.art-image').attr('href',fetched_art[3]);
            artTemplate.find('.art-price').text(fetched_art[5].toNumber());
            artTemplate.find('.art-owner').text(fetched_art[4]);
            artTemplate.find('.art-artist').text(fetched_art[6]);
            artTemplate.find('.btn-buy').attr('data-id', fetched_art[0].c[0]);
            if (fetched_art[7] == false) {
              artTemplate.find('.btn-buy').text('Put on Sale')
            }
            else{
              artTemplate.find('.btn-buy').text('Put off Sale');
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

handleSwitchStatus: function(event) {
  event.preventDefault();

  var artId = parseInt($(event.target).data('id'));
  console.log(artId);
  var adoptionInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Collectibles.deployed().then(function(instance) {
      adoptionInstance = instance;

      console.log(adoptionInstance);

    // Execute switch sale status as a transaction by sending account
    return adoptionInstance.switchSaleStatus.sendTransaction(artId, {from: account});
  }).then(function(result) {
    console.log(result);
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
