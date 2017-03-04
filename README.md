# stora

Usage Example
====================================
import Stora from 'stora';

//To store
Stora.register(idToStoreAs, urlToData);

//To retrieve
Stora.getAsync(refId, function(data) {
  //data retrieved
});

//Clear up all storage
Stora.clearBackup();
