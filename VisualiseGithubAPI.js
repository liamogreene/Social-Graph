$(document).ready(function(){

	$("#search").click(function(){
		var username = $("#term").val() ? $("#term").val() : "github";

		function getUserData(callback) {
			$.get("https://api.github.com/users/" + username) 
		};

		function getUserRepos(callback){
			$.get("https://api.github.com/users/" + username + "/repos", 
				function(data, status){
					success: callback(data,status);
			});
		};

		function getRepoContribs(callback,repo){
			$.get("https://api.github.com/repos/" + username
			 + "/" + repo + "/contributors", 
				function(data, status){
						success: callback(data,status,repo);
			});
		};

		function showRepos(data, status){
			for (var i = 0; i < data.length; i++) {
				$("#repoInfo").append("<li id='repo" + i + "'>" + data[i].name + "</li>");
			};

			$("#repoInfo").children().click(function(){
				var repoChoice = $("#"+this.id).html();
				getRepoContribs(showContribs, repoChoice);
			});
		};

		function showContribs(data, status,repo){
			var APIdata = []; //to store data

			for (var key in data) {
  			if (data.hasOwnProperty(key)) { // print out repos
  				var item = new Object();
					item.info = data[key];
					item.key = key; // stuctured data type 

					APIdata.push(item); // store structured data type
  			};
  		};

  		//begin d3 graph
			xScale.domain(APIdata.map(function (data) {
				data.key = Number(data.key) + 1;
				return data.key; 
			}))

			//label graph
		  rect = svg.selectAll("bar").data(APIdata);
		  Labels = svg.selectAll("text").data(APIdata);

		  // update axis/title
			svg.select(".xaxis")
		    .call(xAxis);

			svg.select(".yaxis")
				.call(yAxis);

			svg.select(".chartTitle")
				.text(repo);
		}; 

		getUserRepos(showRepos);

		// chart size
		var APIdata2 = [];
		var top = 100; 
		var right = 40; 
		var bottom = 80;
		var left = 40;           
		var height = 600;
		var width = 1100;
	
		var svg = d3.select("div#chart")
	    .append("svg")
	    .attr("width", width + left + right)
	    .attr("height", height + top + bottom);

		var yScale = d3.scale.ordinal()
	    .domain([0, d3.max(APIdata2, function(d) {
	    	return d.info; 
	    })
	    ])
	    .range([height,top]);
		var yAxis = d3.svg.axis().scale(yScale).orient("left");

	  // define the x scale
		var xScale = d3.scale.ordinal()
	    .domain(APIdata2.map(function (d) {
	    	return d.key; 
	    }))
	    .rangeRoundBands([left, width]);
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

		// draw the x axis
		svg.append("g")
	    .attr("class", "xaxis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

		// draw the y axis
		svg.append("g")
	    .attr("class", "yaxis")
	    .attr("transform","translate(" + left + ",0)")
	    .call(yAxis);

		// lable y axis
		svg.append("text")
			.attr("transform", "translate(15," + (height / 2) + ")rotate(-90)")
			.text("# characters written");

        // label x axis
		svg.append("text")
			.attr("transform", "translate(" + (width / 2) + "," + (height + (bottom / 2) + 10) + ")")
			.text("contributors");

		// Add original title
		svg.append("text")
			.attr("transform", "translate(" + (width / 2) + ",20)")
			.text("GitHub Repository");
	}); 
});

