$(".add-to-cart").click(function(eventObject) {

  var btnBuyId = eventObject.target.id;
  var productId = btnBuyId.replace('btn-','')
  var btnAddId = 'btn-add-'+productId;

  eventObject.preventDefault();
  axios.post('cart/products/'+productId, {
    productId: this.productId
  })
  .then(function (response) {
    $('#' + btnBuyId).hide();
    $('#' + btnAddId).show();
    setTimeout(ChangeColor2, 1000, btnBuyId, btnAddId);
    console.log(response);
  })
  .then(function (reject) {
    console.log(reject);
  })
  .catch(function (error) {
    console.log(error);
  });
});

function ChangeColor2(btnBuyId, btnAddId)  {
  $('#' + btnBuyId).show();
  $('#' + btnAddId).hide();
} 

$(function () {
  $('[data-toggle="popover"]').popover()
})
