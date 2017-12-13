"use strict";

var go_with_data = function(d){

    console.log("Going with data");
    console.log(d);

    var viz = d3.select("#container").append("div").classed("viz", true);

    var items = viz.selectAll(".item")
	.data(d)
	.enter()
	.append("div")
	.attr("data-agency", function(a){ return a["Agency"]; })
	.classed("item", true);

    var combined_impact = function(a){
	return numeral(a["Deficit Impact FY 2018"]).value()
	    + numeral(a["Deficit Impact FY 2019"]).value()
    };
    
    var titles = items.append("h3")
	.html(function(a){

	    var ret = a["Description"]
	    
	    if (a["Agency"] == "Revenue") { ret += " (Revenue) "; }

	    ret = ret + "<span class='amount'>"
		+ numeral(combined_impact(a)).format("$0a").toUpperCase();
		+ "</span>";

	    return ret;
	});

    var description = items.append("div")
    	.classed("chatter", true)
	// .classed("subtitle", true)
	.html(function(a){
	    var ret = "<span class='chatter-section'>Appropration title: </span> ";
	    if (a["Appropriation Title"].trim().length <= 0) return ret + "--";
	    return ret + a["Appropriation Title"];
	})
    

    var agencies = items.append("div")
	.classed("chatter", true)
	.html(function(a){
	    if (a["Agency"] == "Revenue") return "";
	    return "<span class='chatter-section'>Agency:</span> " +  a["Agency"]; })

    var impact_18 = items.append("div")
	.classed("chatter", true)
	.html(function(a){
	    return "<span class='chatter-section'>Deficit impact in FY 2018:</span> "
		+  "<span class='invert'>" + a["Deficit Impact FY 2018"] + "</span>";
	});

    var impact_19 = items.append("div")
	.classed("chatter", true)
	.html(function(a){
	    return "<span class='chatter-section'>Deficit impact in FY 2019:</span> "
		+ "<span class='invert'>"
		+  a["Deficit Impact FY 2019"]
		+ "</span>";
	    
	});
    
    var legislation = items.append("div")
	.classed("chatter", true)
	.html(function(a){
	    if (a["Requires Legislation"].trim() == "Y"){
		return "<span class='chatter-section'>Requires legislation</span> ";
	    }
	})

    
    
    var comments = items.append("div")
	.classed("chatter", true)
	.html(function(a){
	    if (a["Comments"].trim().length <= 0) return "";
	    return "<span class='chatter-section'>Comments:</span> " + a["Comments"]; 
	});
}

d3.csv("data/deficit-mitigation.csv", go_with_data);

(function(){
    var search = d3.select("#search");
    var search_button = d3.select("#search-button");
   
    console.log("Search");
    
    var do_search = function(){
	var val = search.node().value;
	console.log("Search field is " + val);

	var items = d3.selectAll(".item");

	items.style("display","none");

	items.style("display", function(){
	    var index = d3.select(this).text().toLowerCase()
		.indexOf(val.toLowerCase());

	    if (index >= 0){ return ; }
	    return "none";
	    

	});

	
    };
    
    search.on("keyup", do_search);
    
    search_button.on("click", do_search);

})();
