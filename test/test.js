import Stora from 'stora';

let countryId = 'country';

Stora.register(countryId, '/test/test.json');
Stora.getAsync(countryId, data => {
    console.log(data);
});

//Stora.clearBackup();
