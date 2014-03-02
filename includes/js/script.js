$(function() {

  $('#alertMe').click(function(e){

    e.preventDefault();

    $('#sucessAlert').slideDown();
    
  });

  $('a.pop').click(function(e)  {
    e.preventDefault();
  }); 

  $('a.pop').popover();

  $('[rel="tooltip"]').tooltip();

});