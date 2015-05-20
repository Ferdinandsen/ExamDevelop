(function () {
  'use strict';
  
  function Bird() {
    console.log('pip');
  }

  window['pixione'] = window['pixione'] || {};
  window['pixione'].Bird = Bird;
}());