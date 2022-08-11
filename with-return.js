const formParts = {
  inputZipcode: document.forms['address_form'].elements['postal_code'],
  searchAddress: document.querySelector('#search-address'),
  searchAddressButton: document.querySelector('#search-address-button'),
  searchedAddress: document.querySelectorAll('.searched-address'),
  inputPrefecture: document.forms['address_form'].elements['prefecture'],
  inputCity: document.forms['address_form'].elements['city'],
  inputAddress1: document.forms['address_form'].elements['address1'],
  inputAddress2: document.forms['address_form'].elements['address2'],
}

const zipcodeApi = 'https://zipcloud.ibsnet.co.jp/api/search';

const fetchApi = async (endpoint) => {
  const response = await fetch(endpoint);
  return response.json();
};

const autoAddress = async () => {
  const zipcode = formParts.inputZipcode.value;
  if(zipcode) {
    const zipcodeParam = `?zipcode=${zipcode}`;
    fetchApi(zipcodeApi + zipcodeParam)
    .then(value => {
      const addresses = value.results; // => "返り値"
      const searchedAddressesElement = document.querySelector('.searched-addresses');
      if(addresses.length <= 1) {
        if(!(searchedAddressesElement === null)) {
          searchedAddressesElement.remove();
        }
        formParts.inputPrefecture.value = addresses[0].address1;
        formParts.inputCity.value = addresses[0].address2;
        formParts.inputAddress1.value = addresses[0].address3;
      } else {
        if(!(searchedAddressesElement === null)) {
          searchedAddressesElement.remove();
        }
        let searchedAddresses = document.createElement('div');
        searchedAddresses.classList.add('searched-addresses');
        formParts.searchAddress.insertBefore(searchedAddresses, formParts.searchAddressButton.nextElementSibling);
        Object.entries(addresses).forEach( address => {
          const addressIndex = address[0];
          const addressData = address[1];
          const addressChineseCharacters = `${addressData['address1']} ${addressData['address2']} ${addressData['address3']}`
          let searchedAddress = document.createElement('button');
          searchedAddress.type = 'button';
          searchedAddress.classList.add('searched-address');
          searchedAddress.dataset.value = addressIndex;
          searchedAddress.textContent = addressChineseCharacters;
          searchedAddresses.append(searchedAddress);
        });
        searchedAddresses.addEventListener('click', (event) => {
          const AddressIndex = event.target.dataset.value;
          formParts.inputPrefecture.value = addresses[AddressIndex].address1;
          formParts.inputCity.value = addresses[AddressIndex].address2;
          formParts.inputAddress1.value = addresses[AddressIndex].address3;
        })
      };
    });
  };
};

formParts.searchAddressButton.addEventListener('click', autoAddress);
