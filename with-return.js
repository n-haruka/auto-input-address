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

const fetchApi = async (endpoint) => (await fetch(endpoint)).json();

const autoAddress = async () => {
  const zipcode = formParts.inputZipcode.value;
  if (zipcode) {
    const zipcodeParam = `?zipcode=${zipcode}`;
    fetchApi(zipcodeApi + zipcodeParam)
      .then(value => {
        const addresses = value.results; // => "返り値"
        const searchedAddressesElement = document.querySelector('.searched-addresses');

        const initSearchedAddresses = () => {
          if (!(searchedAddressesElement === null)) {
            searchedAddressesElement.remove();
          }
        }

        const setAddress = (addressesIndex) => {
          formParts.inputPrefecture.value = addresses[addressesIndex].address1;
          formParts.inputCity.value = addresses[addressesIndex].address2;
          formParts.inputAddress1.value = addresses[addressesIndex].address3;
        }

        if (addresses.length <= 1) {
          initSearchedAddresses();
          setAddress(0);
        } else {
          initSearchedAddresses();
          let searchedAddresses;

          const createAddressesAriaFactory = () => {
            searchedAddresses = document.createElement('div');
            searchedAddresses.classList.add('searched-addresses');
            formParts.searchAddress.insertBefore(searchedAddresses, formParts.searchAddressButton.nextElementSibling);

            return (addressIndex, addressChineseCharacters) => {
              let searchedAddress = document.createElement('button');
              searchedAddress.type = 'button';
              searchedAddress.classList.add('searched-address');
              searchedAddress.dataset.value = addressIndex;
              searchedAddress.textContent = addressChineseCharacters;
              searchedAddresses.append(searchedAddress);
            }
          }
          const createAddressesAria = createAddressesAriaFactory();
          Object.entries(addresses).forEach(address => {
            const addressIndex = address[0];
            const addressData = address[1];
            const addressChineseCharacters = `${addressData['address1']} ${addressData['address2']} ${addressData['address3']}`;

            createAddressesAria(addressIndex, addressChineseCharacters);
          });
          searchedAddresses.addEventListener('click', (event) => {
            const AddressIndex = event.target.dataset.value;
            setAddress(AddressIndex);
          });
        };
      });
  };
};

formParts.searchAddressButton.addEventListener('click', autoAddress);