
$.ajax('/getVenueData', { type: 'GET' }).then(renderVenues);
$.ajax('/getTeamData', { type: 'GET' }).then(renderTeams);
$.ajax('/getCardData', { type:'GET' }).then(renderCards);

function renderVenues(v1){
  $(document).ready(function(){
    $('.venues-container').html(getVenueHtml(v1,"Venue"));
  });
}

function renderTeams(v1){
  $(document).ready(function(){
    $('.teams-container').html(getVenueHtml(v1,"Team"));
  });
}

function renderCards(v2){
  var jTodoList = $('.cards-container').empty();
  $(document).ready(function() {
    $('.cards-container').html(v2);
  });  
}

function getVenueHtml(v1, typeLabel){
  return '<div class="team-container clearfix">' +
            '<div class="filter-venue">' + 
            '<p><strong>Filter By ' + typeLabel+' </strong></p></div>' +
            '<div class="btn-group btn-group-md col-lg-12 col-md-12 col-sm-12 col-xs-12 grouped-buttons" role="group">' +
             v1 + 
            '<button type="submit" class = "btn btn-danger btn-md " id="ResetButton" role = "button">Reset</button></div> </div>';
}

// ------- Events -------------//
//click event on Team and Venue Buttons
$('body').on('click', '.buttons', function(){
    var filterType=$(this).attr('filter-type');
    var id=$(this).attr('data-key');
  $.ajax('/getCardDataByFilter', {
    type: 'POST',
    data: {id,filterType},
    }).then(renderCards);
  }
)

//click event on Reset Buttons
$('body').on('click', '#ResetButton ', function(){
    $.ajax( '/getCardData', {
        type: 'GET',
    })
    .then( renderCards);
});


