//require('bootstrap');
/*global $ */
import { greeter } from './greeter'

setTimeout(greeter, 500);

// exports.printMsg = function() {
//     console.log("This is a message from the demo package");
//   }
var $titleField = $('input[name="title"]');
// $('.save-btn').on('click', function(event){
//   event.preventDefault();
//   if($titleField.val().length > 2){
//     console.log("okay")
//     $titleField.removeClass('is-invalid')
//   }else{
//     $titleField.addClass('is-invalid')
//   }
// })
$titleField.on('keyup', function(event){
  event.preventDefault();
  if($titleField.val().length > 2){
    console.log('okay');
    $titleField.removeClass('is-invalid');
  }else{
    $titleField.addClass('is-invalid');
  }
});
