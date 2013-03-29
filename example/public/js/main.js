'use-strict';
 
define(
  'main'
  ,[
    'app'
    ,'controllers/contact'
 //   ,'directives/todoBlur'
 //   ,'directives/todoFocus'
 //   ,'services/todoStorage'
  ]
  ,function mainModule(myapp) {
    myapp.init();
  }
)