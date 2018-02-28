$( document ).ready(function() {

  /*******************************
               Setup
  *******************************/

  // Vars
  var docWidth;
  var docHeight;
  var currentScreen;
  var globalMontantValue;
  var lengthRowSelected;



  // Dropdown behavior

  $('.ui.dropdown')
  .dropdown()
  ;

  // Image bg

  var memberPicture = $('.member__picture.pic');

  //console.log( memberPicture.width() );

  // Add base 64 pic (if pic)
  memberPicture.src = 'data:image/jpeg;base64,'+'R0lGODdhMAAwAPAAAAAAAP///ywAAAAAMAAw AAAC8IyPqcvt3wCcDkiLc7C0qwyGHhSWpjQu5yqmCYsapyuvUUlvONmOZtfzgFz ByTB10QgxOR0TqBQejhRNzOfkVJ+5YiUqrXF5Y5lKh/DeuNcP5yLWGsEbtLiOSp a/TPg7JpJHxyendzWTBfX0cxOnKPjgBzi4diinWGdkF8kjdfnycQZXZeYGejmJl ZeGl9i2icVqaNVailT6F5iJ90m6mvuTS4OK05M0vDk0Q4XUtwvKOzrcd3iq9uis F81M1OIcR7lEewwcLp7tuNNkM3uNna3F2JQFo97Vriy/Xl4/f1cf5VWzXyym7PH hhx4dbgYKAAA7';
  memberPicture.css("background-image", "url('" + memberPicture.src  + "')");


}); // End document Ready
