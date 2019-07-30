/*const ipfs = window.IpfsHttpClient('localhost', '5001')

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
    console.error("User denied account access")
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

return App.initContract();
},

initContract: function(data) {

  $.getJSON('../Collectibles.json', function(data) {
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
  $(document).on('submit', '#form1', App.createArt)
},

createArt: function(event){
  event.preventDefault();
  data = $('$form1').serialize();
  console.log(data);
  var name = data['name'];
  var desc = data['description'];
  var image = data['image_url'];
  var price = data['pricepir'];

  var file = {
    path:image
  }

  ipfs.add(file).then(function(data){
    var hash = data[0].hash;
  }).catch(function(err){
    console.log(err.message);
    alert('Error Occurred');
    return null;
  });

  if (name == '' || desc == '' || image_url == '' || price == '') {
    alert('Cant leave enything empty');
    return null;
  }

  var adoptionInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Collectibles.deployed().then(function(instance) {
      adoptionInstance = instance;

    // Execute adopt as a transaction by sending account
    return adoptionInstance.convert_art(name,desc,hash,parseInt(price), {from: account});
  }).then(function(result) {
    alert('Your Art has been decentralised', result);
    return App.listArt();
  }).catch(function(err) {
    console.log(err.message);
  });
});

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
        var petsRow = $('#petsRow');
        var petTemplate = $('#petTemplate');
        petTemplate.find('.panel-title').text(fetched_art[0]);
        petTemplate.find('img').attr('src', fetched_art[1]);
        petTemplate.find('.pet-breed').text(fetched_art[2]);
        petTemplate.find('.pet-age').text(fetched_art[3]);
        petTemplate.find('.pet-location').text(fetched_art.location);
        petTemplate.find('.btn-adopt').attr('data-id', fetched_art.id);

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

  var adoptionInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Collectibles.deployed().then(function(instance) {
      adoptionInstance = instance;

    // Execute adopt as a transaction by sending account
    return adoptionInstance.convert_art(petId, {from: account});
  }).then(function(result) {
    return App.markAdopted();
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
*/