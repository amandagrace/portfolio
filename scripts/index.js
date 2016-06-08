/*------GRAPH------*/
/*get and set graph size*/
var width =  $("#graph").width(),
    height = $("#graph").height();
var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

/*--VARIABLES--*/
var bubbleScale = 12, iconSize = 3 * bubbleScale * 2,
linkDistance = width / 10, charge = width, drift = .03,
updateInterval = 200, textDistance = 5;

/*link distance greater than 40 and less than 80*/
if (linkDistance < 30) {
  linkDistance = 30;
} else if (linkDistance > 80) {
  linkDistance = 80;
}

/*charge greater than 400 and less than 800*/
if (charge < 400) {
  charge = 400;
} else if (charge > 800) {
  charge = 800;
}
charge = -charge; //charge must be negative

/*creating gradient and image patterns*/
var defs = svg.append("defs");
/*gradients*/
  /*red*/
  var radialGradient1 = defs
    .append("radialGradient")
    .attr("id", "radial-gradient1");
  radialGradient1.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#FCBEA4");
  radialGradient1.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#F88A6B");
  /*blue*/
  var radialGradient2 = defs
    .append("radialGradient")
    .attr("id", "radial-gradient2");
  radialGradient2.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#D9FFF8");
  radialGradient2.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#B3F3E7");
  /*green*/
  var radialGradient3 = defs
    .append("radialGradient")
    .attr("id", "radial-gradient3");
  radialGradient3.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#C7FFDA");
  radialGradient3.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#89F0AC");
  /*yellow*/
  var radialGradient4 = defs
    .append("radialGradient")
    .attr("id", "radial-gradient4");
  radialGradient4.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#F5FFC6");
  radialGradient4.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#EBF8AB");
  /*purple*/
  var radialGradient5 = defs
    .append("radialGradient")
    .attr("id", "radial-gradient5");
  radialGradient5.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#E8E1EF");
  radialGradient5.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#CCB7E0");

/*images*/
var iconImage10 = defs
  .append("pattern")
  .attr("id", "iconImage10")
  .attr("height", 1)
  .attr("width", 1)
  .append("image")
  .attr("xlink:href", "assets/thumbnails/indie.png")
  .attr("height", iconSize)
  .attr("width", iconSize);
var iconImage11 = defs
  .append("pattern")
  .attr("id", "iconImage11")
  .attr("height", 1)
  .attr("width", 1)
  .append("image")
  .attr("xlink:href", "assets/thumbnails/bond.png")
  .attr("height", iconSize)
  .attr("width", iconSize);
var iconImage12 = defs
  .append("pattern")
  .attr("id", "iconImage12")
  .attr("height", 1)
  .attr("width", 1)
  .append("image")
  .attr("xlink:href", "assets/thumbnails/coke.jpg")
  .attr("height", iconSize)
  .attr("width", iconSize);
var iconImage13 = defs
  .append("pattern")
  .attr("id", "iconImage13")
  .attr("height", 1)
  .attr("width", 1)
  .append("image")
  .attr("xlink:href", "assets/thumbnails/buzz.png")
  .attr("height", iconSize)
  .attr("width", iconSize);
var iconImage14 = defs
  .append("pattern")
  .attr("id", "iconImage14")
  .attr("height", 1)
  .attr("width", 1)
  .append("image")
  .attr("xlink:href", "assets/thumbnails/colorful.jpg")
  .attr("height", iconSize)
  .attr("width", iconSize);


/*setting up force layout with d3*/
var force = d3.layout.force()
    .charge(charge)
    .linkDistance(function(d) {
      return linkDistance * d.value;
    })
    .size([width, height]);
d3.json("data.json", function(error, graph) {
  if (error) throw error;
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();
  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link");
  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", function(d) {
        return "node " + d.class; //add css classes to html object
      })
      .call(force.drag)
      .on("mouseover",function(){ //move object to front on mouseover
        var sel = d3.select(this);
        sel.moveToFront();
      });
  var dot = node.append("circle")
      .attr("r", function(d) {return d.value * bubbleScale;})
      .style("fill", function(d){
        if (d.group < 10) {
          return "url(#radial-gradient" + d.group +")";
        } else {
          return "url(#iconImage"+d.group +")";
        }
      });
  var text = node.append("text")
      .attr("dx", function(d) {
         return d.value * bubbleScale + textDistance;
       })
      .attr("dy", 5)
      .attr("class", "smooth shadowed")
      .text(function(d) { return d.name });
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("dx", function(d) {
           if (width < 800 && d.x > .5 * width) {
             $(this).css("text-anchor", "end");
             return -(d.value * bubbleScale + textDistance);
           } else {
             $(this).css("text-anchor", "start");
             return d.value * bubbleScale + textDistance;
           }
         });
    dot.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
  /*transition to case study*/
  var cases = svg.selectAll(".case")
  .on("click", function(d) {
    showWork(d.url);
  });
});

/*transition to case study*/
function showWork(url) {
  window.location = url;
}

/*creating drift effect*/
setTimeout(function() { //delay after initial tick
  d3.timer(function(){force.alpha(drift);},updateInterval);
}, 2000);

/*function to move object to front*/
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
  this.parentNode.appendChild(this);
  });
};

/*filter graph content*/
var currentFilter = "all";
function filter(key) {
  if (!$(key).hasClass("disabled")) {
    $("#" + currentFilter).removeClass('selected');
    $(key).addClass("selected");
    currentFilter = $(key).attr("id");
    $(".node").css("opacity", .2);
    if (currentFilter != "all") {
      $("." + currentFilter).css("opacity", 1);
    } else {
      $(".node").css("opacity", 1);
    }
  }
}


/*------END OF GRAPH FUNCTIONS------*/


/*------MOBILE DISCLAIMER------*/
/*Advises user to check website out on larger screen*/
$(document).ready(function() {
  if ($(window).width() <= 480 || $(window).height() <= 480) {
    $("#mobile-disclaimer").fadeIn(500);
  }
});

function closeDisclaimer() {
  $("#mobile-disclaimer").fadeOut(500);
}

/*------TOGGLE MOBILE MENU------*/
function showMenu() {
  $("#mobile-menu").show();
  $("#hamburger").fadeOut(1000);
  $("#mobile-menu").animate({
    right: "0px"
  }, 1000, function() {
    $("body").click(hideMenu); //allow clicking out
  });
}
function hideMenu() {
  var menuWidth = $("#mobile-menu").css("width");
  $("#mobile-menu").animate({
    right: "-" + menuWidth
  }, 1000, function() {
    $("#hamburger").fadeIn(500);
    $("#mobile-menu").hide();
  });
  $("body").unbind("click");
}

/*------TOGGLE CONTENT------*/

var graphDisplayed = true;
var currentContent = "work";

/*changing content*/
function toGraph() {
  if (!graphDisplayed) {
    changeSelectedLink("work");
    $("#content").fadeOut(500, function() {
      $("#" + currentContent).hide();
      currentContent = "work";
      $("#graph").fadeIn(500);
    });
    graphDisplayed = true;
    $(".filter").removeClass("disabled");
  }
}

function toContent(key) {
  if (currentContent != key) {
    changeSelectedLink(key);
    if (graphDisplayed) {
      transitionFromGraph(key);
    } else {
      transitionContent(key);
      $("html, body").animate({ scrollTop: 0 }, "slow");
    }
  }
  currentContent = key;
}

function changeSelectedLink(key) {
  $("." + currentContent + "Link").removeClass("selected");
  $("." + key + "Link").addClass("selected");
}

function transitionFromGraph(key) {
  //fade graph out, then fade in content and reset node opacity
  $("#graph").fadeOut(500, function() {
    $("#" + key).show();
    $("#content").fadeIn(500);
    $(".node").css("opacity", 1);
  });
  //reset and disable filters
  $("#" + currentFilter).removeClass('selected');
  currentFilter = "all";
  $("#all").addClass("selected");
  $(".filter").addClass("disabled");
  //set boolean
  graphDisplayed = false;
}

function transitionContent(key) {
  $("#" + currentContent).fadeOut(500, function() {
    $("#" + key).fadeIn(500);
  });
}

/*CONTACT FORM*/
$(function() {
  var form = $("#contact-form");

  var formMessages = $("#form-messages");

  $(form).submit(function(event) {
      event.preventDefault();

      var formData = $(form).serialize();

      $.ajax({
        type: 'POST',
        url: $(form).attr('action'),
        data: formData
      })
      .done(function(response) {
        // Make sure that the formMessages div has the 'success' class.
        $(formMessages).removeClass('error');
        $(formMessages).addClass('success');

        // Set the message text.
        $(formMessages).text(response);

        // Clear the form.
        $('#name').val('').removeClass('errorField');
        $('#email').val('').removeClass('errorField');
        $('#message').val('').removeClass('errorField');
      })
      .fail(function(data){
        // Make sure that the formMessages div has the 'error' class.
        $(formMessages).removeClass('success');
        $(formMessages).addClass('error');

        // Set the message text.
        response = data.responseText;
        if (response !== '') {
          if (response == "nameError") {
            $(formMessages).text("Whoops! I need your name first. Fill that out and try again.");
            $('#name').addClass('errorField');
          } else if (response == "emailError") {
            $(formMessages).text("There seems to be an issue with your email. Check that and try again.");
            $('#email').addClass('errorField');
          } else if (response == "messageError") {
            $(formMessages).text("Surely you have something to say! Add a message and try again.");
            $('#message').addClass('errorField');
          } else if (response == "generalError") {
            $(formMessages).text('Uh oh. Something went wrong. Please try again.');
        }
      }
    });
});

$("#name").focus(function() {$("#name").removeClass('errorField');});
$("#email").focus(function() {$("#email").removeClass('errorField');});
$("#message").focus(function() {$("#message").removeClass('errorField');});

});

$(function() {
  var content = $('#main').smoothState({
    onStart : {
      duration: 250,
      render: function() {
        content.toggleAnimationClass("is-exiting")
      }
    }
  })
}).data('smoothState');
