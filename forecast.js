window.fbAsyncInit = function() 
{
		FB.init({
			appId      : '918623554886841',
			xfbml      : true,
			version    : 'v2.5',
		});
};


var fb_address;
var fb_icon;
var fb_summary;
var fb_temperature;
var fb_cf;

	(function(d, s, id)
     {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "https://connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
	function postToFeed()
    {	
		FB.login(function(response){
			if (response.authResponse)
            {
				FB.ui(
                {
                    method: 'feed',
					name: "Current Weather in " + fb_address,
					link: "http://www.forecast.io",
					description: fb_summary + ", " + fb_temperature + fb_cf,
					picture: fb_icon,
					caption: "WEATHER INFORMATION FROM FORECAST IO ",
					display: "popup"
       
				},function(response)
                    { 
                        if(response && response.post_id)
                        {
                            alert("Posted Successfully");
                        }
                        else
                        {
				            alert('Not POsted! ');
			             }
                    });
			}
			else
            {
				alert('Not POsted! ');
			}
		});
	}

				
				//fb end
$(document).ready(function(){
				
	
	$('#search').click(function(){
		var address = $('#addr').val();
		var city = $('#city').val();
		var state = $('#state').val();
		var degree =  $('input[name="degree"]:checked').val();
		var flag = true;
		
		if(address.trim() != ""){
			
			$('#erroraddress').css('visibility', 'hidden');
		}
		else{
			flag = false;
			$('#erroraddress').css('visibility', 'visible');
		}
		if(city.trim() != ""){
			
			$('#errorcity').css('visibility', 'hidden');
		}
		else{
			flag = false;
			$('#errorcity').css('visibility', 'visible');
		}
		if(state != ""){
			
			$('#errorstate').css('visibility', 'hidden');
		}
		else{
			flag = false;
			$('#errorstate').css('visibility', 'visible');
		}
		if(flag == true){
			
			executedata(address,city,state,degree);
		}
		
	});
	
	$('#addr').bind("keyup focusout change", function(){
		
			if($('#addr').val().trim()!=""){
				$('#erroraddress').css('visibility','hidden');
			}
			else{
				$('#erroraddress').css('visibility','visible');
			}
			
	});
	
	$('#city').bind("keyup focusout change", function(){
		
			if($('#city').val().trim()!=""){
				$('#errorcity').css('visibility','hidden');
			}
			else{
				$('#errorcity').css('visibility','visible');
			}
			
	});
	
	$('#state').bind("keyup focusout change", function(){
		
			if($('#state').val().trim()!=""){
				$('#errorstate').css('visibility','hidden');
			}
			else{
				$('#errorstate').css('visibility','visible');
			}
			
	});	
	
	$('#reset').click(function(){
		$('#erroraddress').css('visibility','hidden');
		$('#errorstate').css('visibility','hidden');
		$('#errorcity').css('visibility','hidden');
		$('#addr').val("");
		$('#state').val("");
		$('#city').val("");
		$('#degree').prop('checked',true);
        $('#navid').css('visibility','hidden');
        $('#mapData').html("");
	});	
	
	
	
	function executedata(address,city,state,degree){
			$.ajax({	
				url:'index.php',
				data:{
					'address':address,	
					'city':city,
					'state':state,
					'degree':degree
				},
				type:'GET',
				dataType: 'json',
				success:function(output){
					$('#navid').css('visibility','visible');
					var obj = jQuery.parseJSON(output);
					
					//START OF TAB 1
					var current_summary = obj.currently.summary;
					var current_temperature = parseInt(obj.currently.temperature);
					var current_precipintensity = obj.currently.precipIntensity;
					var current_precipitation;
					var current_precipprobability = obj.currently.precipProbability;
					var current_chanceofrain = 100 * current_precipprobability + " %";
					
					var latitude=obj.latitude;
					var longitude=obj.longitude;
					var current_icon_name=obj.currently.icon;
					var icon_name;
					var current_tempmax = parseInt(obj.daily.data[0].temperatureMax);
					var current_tempmin = parseInt(obj.daily.data[0].temperatureMin);
					var current_windspeed = (obj.currently.windSpeed);
					var current_dewpoint = (obj.currently.dewPoint).toFixed(2);
					var current_humidity = parseInt(obj.currently.humidity * 100) + " %";
                    var current_sunrise = obj.daily.data[0].sunriseTime;
					var current_sunset = obj.daily.data[0].sunsetTime;
					var timezone = obj.timezone;
					var intermediate_sunrise=moment.unix(current_sunrise);
					var current_sunrise_formatted=intermediate_sunrise.tz(timezone).format("hh:mm A");
					var intermediate_sunset=moment.unix(current_sunset);
					var current_sunset_formatted=intermediate_sunset.tz(timezone).format("hh:mm A");
					var cf;
                    
                    current_icon = getIcon(current_icon_name);	
					
                    if(degree=="si")
                        current_precipintensity=current_precipintensity/25.4;
                    current_precipitation = getPrecip(current_precipintensity);
                    
                    if(degree == "si")
                    {
						cf = "&#176;C";
						current_dewpoint += "&#176;C";
//						current_visibility += " kM";
                        var current_visibility =isNaN(obj.currently.visibility)? 'NA': (obj.currently.visibility).toFixed(2)+" KM";
						var current_windspeed = isNaN(obj.currently.windSpeed)? 'NA' :(obj.currently.windSpeed).toFixed(2)+" MS";
                    
					}	
					else
                    {
						cf = "&#176;F";
						current_dewpoint += "&#176;F";
						//current_visibility += " MI";
                        var current_visibility =isNaN(obj.currently.visibility)? 'NA': (obj.currently.visibility).toFixed(2)+" MI";
						var current_windspeed = isNaN(obj.currently.windSpeed)? 'NA' :(obj.currently.windSpeed).toFixed(2)+" MPH";
					}
					
					fb_address = city + ", " + state;
					fb_icon = current_icon;
					fb_summary = current_summary;
					fb_temperature = current_temperature;
					fb_cf = cf;
					
					var table = "<div style='background-color:#F27E7F' class='row'>";
					
                    table+="<div align=center class=' col-md-6 col-sm-6'><img style='display:block;width:130px;height:130px' title='"+ current_summary +"' alt='"+ current_summary + "' src='" + current_icon + "'/></div>";
					
                    table+="<div align='center' class='col-md-6'><span style='color:white'>" + current_summary + " in " + city + ", " + state + "<br>" + "<span style='font-size:60px'>" + current_temperature + "</span><span style='font-size:16px; position:relative;top:-2.0em;'> " + cf + "</span><br>" + "<span><img style='margin-right:10px;display:inline-block;' src='http://cs-server.usc.edu:45678/hw/hw8/images/fb_icon.png' class='img-responsive pull-right' width=35px height=35px title= 'Click me, to post in fb!' onclick=postToFeed()> "+"<span style='color:blue;line-height:4'>L: " + current_tempmax + "&#176;</span>" + "<span style='color:black;'> | </span>" + "<span style='color:green'>H: " +current_tempmin + "&#176;</span></span></span>" + "</div>";
					
                    table+="</div>";
					
                    table+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Precipitation</div><div class='col-md-5 col-xs-5 col-sm-5'>" + current_precipitation + "</div></div></div>";
                    
					table+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Chance of Rain</div><div class='col-md-5 col-xs-5 col-sm-5'>" + current_chanceofrain + "</div></div></div>";
                    
					table+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Wind Speed</div><div class='col-md-5 col-xs-5 col-sm-5'>" + current_windspeed + "</div></div></div>";
                    
					table+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Dew Point</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_dewpoint + "</div></div></div>";
                    
					table+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Humidity</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_humidity + "</div></div></div>";
                    
					table+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Visibility</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_visibility + " </div></div></div>";
                    
					table+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Sunrise</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_sunrise_formatted + " </div></div></div>";
                    
					table+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Sunset</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_sunset_formatted + " </div></div></div>";
                    
					$('#firsttab_table').html(table);

					//open map code starts here
					$(function() 
                    {
						$('#mapData').html("");
                        var map = new OpenLayers.Map("mapData");
						var mapnik = new OpenLayers.Layer.OSM();
		
						var layer_cloud = new OpenLayers.Layer.XYZ(
								"clouds",
								"http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
							{
								isBaseLayer: false,
								opacity: 0.7,
								sphericalMercator: true
							}
						);
						var layer_precipitation = new OpenLayers.Layer.XYZ(
								"precipitation",
								"http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
							{
								isBaseLayer: false,
								opacity: 0.7,
								sphericalMercator: true
							}
						);
						map.addLayers([mapnik, layer_precipitation, layer_cloud]);
						map.addControl(new OpenLayers.Control.LayerSwitcher());     
					
						var lonlat = new OpenLayers.LonLat(longitude, latitude).transform(
							new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
							map.getProjectionObject() // to Spherical Mercator Projection
						);
						map.setCenter( lonlat, 8 );		
						
						var markers = new OpenLayers.Layer.Markers( "Markers" );
						map.addLayer(markers);
						markers.addMarker(new OpenLayers.Marker(lonlat));
						
					});
					//open map code ends here
					
					// END OF TAB 1
				//open map code ends here
				
            // Tab 1 Ends
                
            //Tab 2 starts
                
            var json_data = jQuery.parseJSON(output);
            var timezone=json_data.timezone;
        
            var i=0;
            var tab_2="";
            for(i=0;i<24;i++)
            {
                var rise    =  moment.unix(json_data.hourly.data[i].time);
                var local   =  moment.tz(rise, "America/Los_Angeles");
                var t=rise.tz(timezone).format('hh:mm A');
                var icon_name=json_data.hourly.data[i].icon;
                
                var icon = getIcon(icon_name);	
                                
                var unit_visibility,unit_windspeed,unit_pressure;
                if(degree == "si")
                {
					//unit_visibility = " KMS";
					//unit_windspeed = " M/S";
                    unit_pressure=" MB";
                    json_data.hourly.data[i].visibility=isNaN(json_data.hourly.data[i].visibility)?'NA':(json_data.hourly.data[i].visibility)+"KM";
json_data.hourly.data[i].windSpeed = isNaN(json_data.hourly.data[i].windSpeed)?'NA':json_data.hourly.data[i].windSpeed+" M/S";
//json_data.hourly.data[i].pressure = isNAN(json_data.hourly.data[i].pressure)?'NA':json_data.hourly.data[i].pressure+" M/S";
                    
                    
                    $('#tmpdeg').html("Temp(&#176C)")
				}	
				else
                {
					//unit_visibility = " MI";
					//unit_windspeed = " MPH";
                    unit_pressure=" hPa";
                    
                json_data.hourly.data[i].visibility=isNaN(json_data.hourly.data[i].visibility)?'NA':json_data.hourly.data[i].visibility+"MI";
json_data.hourly.data[i].windSpeed = isNaN(json_data.hourly.data[i].windSpeed)?'NA':json_data.hourly.data[i].windSpeed+" MPH";
//json_data.hourly.data[i].pressure = isNAN(json_data.hourly.data[i].pressure)?'NA':json_data.hourly.data[i].pressure+" hPa";
                    $('#tmpdeg').html("Temp(&#176F)")
				}
                                 
                tab_2+= "<div class='panel panel-default' style='margin:0'>";
                    tab_2+="<div class='panel-heading' style='background-color:white'>";
                        tab_2+="<h4 class=\"panel-title\">";
                            tab_2+="<div class='row' style='text-align:center'>";
                                tab_2+="<div class='col-md-2 col-sm-2 col-xs-2 col-lg-2'>"+t+"</a></div>";
                              
                    tab_2+="<div class='col-md-3 col-sm-3 col-xs-3 col-lg-3'>";
                    tab_2+= "<img src='" + icon + "'alt='"+json_data.hourly.data[i].icon+ "'style='width:50px;height:50px'</img></div>";
                                 
                    tab_2+="<div class='col-md-2 col-sm-2 col-xs-2 col-lg-2'>";
                 tab_2+= parseInt((json_data.hourly.data[i].cloudCover)*100) + "% </div>";
                     
   
                    tab_2+="<div class='col-md-2 col-sm-2 col-xs-2 col-lg-2'>";
                    tab_2+= json_data.hourly.data[i].temperature.toFixed(2);
                    tab_2+= "</div>";
                 
                    tab_2+="<div class='col-md-3 col-sm-3 col-xs-3 col-lg-3'>";
                    tab_2+=  "<a data-toggle='collapse' data-parent='#accordion' href='#collapse"+i+"'>";
                    tab_2+="<span class='glyphicon glyphicon-plus'></span></a></div></div></h4></div>";
                 
                    tab_2+=" <div id='collapse"+i + "'class='panel-collapse collapse'>";
                    tab_2+="<div class='panel-body' style='overflow:auto'>"
                    tab_2+="<table class=table>";
                    tab_2+="<tr style='background-color:white; font-size:12px;'>";
                    tab_2+="<th style='text-align:center'>Wind Speed</th>";
                    tab_2+="<th style='text-align:center'>Humidity</th>";
                    tab_2+="<th style='text-align:center'>Visibility</th>";
                    tab_2+="<th style='text-align:center'>Pressure</th></tr>";
                                 
                    tab_2+="<tr style='font-size:10px'><tr>";
                                 
                    tab_2+="<td style='text-align:center; font-size:12px'>" + json_data.hourly.data[i].windSpeed ;
                    tab_2+="</td>";
                 
                    tab_2+="<td style='text-align:center; font-size:12px'>" + parseInt((json_data.hourly.data[i].humidity)*100) + "%";
                    tab_2+="</td>";
                 
                    tab_2+="<td style='text-align:center; font-size:12px'>" + json_data.hourly.data[i].visibility ;
                    tab_2+="</td>";
                 
                    tab_2+="<td style='text-align:center; font-size:12px'>" + json_data.hourly.data[i].pressure + unit_pressure;
                    tab_2+="</td></tr></table></div></div></div>";
                    
             }
        
                $("#accordion").html(tab_2);
                //Tab 2 Ends here    
            
                //Tab 3 Starts here
                getDailyData(json_data);
                
				
			},
			error:function()
            {
				alert('data sending failed');
			}
		});
}
    
    function getDailyData(jsonObject)
    {
			var dailyArr = [];
			var dateObject;
			var buttonTextData;
			var modalTextData;
			var day, date, month, monthDate, image, minTemp, maxTemp;
			var dailyData = jsonObject.daily.data;
			for(i=1;i<dailyData.length;i++)
            {
				dateObject = new Date(dailyData[i].time*1000);
				day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()];
				month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][dateObject.getMonth()];			
				date = dateObject.getDate();
				monthDate = month+" "+date;
				icon = getIcon(dailyData[i].icon);	
				minTemp = Math.floor(dailyData[i].temperatureMin)+"&deg";
				maxTemp = Math.floor(dailyData[i].temperatureMax)+"&deg";
				dailyArr.push({
					"day": day,
					"monthDate": monthDate,
					"icon": icon,
					"minTemp": minTemp,
					"maxTemp": maxTemp
				});
				
                buttonTextData="<h5>"+day+"<h5>"+monthDate+"<br><img height='60px' width='60px' src='"+icon+"'><br>";
				buttonTextData+="Min<br>Temp<br>"+"<h3>"+minTemp+"<h5><br>Max<br>Temp<br>"+"<h3>"+maxTemp;
				
                var id="#button"+i;
				$(id).html(buttonTextData);

				var current_summary=dailyData[i].summary;
				var current_temp = parseInt(jsonObject.daily.data[0].temperature);
				var current_temp_max=parseInt(jsonObject.daily.data[0].temperatureMax);
				var current_temp_min=parseInt(jsonObject.daily.data[0].temperatureMin);
				
				var precip_no=jsonObject.daily.data[i].precipIntensity;
                var current_precipitation;
				
                if(degree == "si")
					precip_no=precip_no/25.4;
                
                current_precipitation = getPrecip(precip_no);
						
				var precip_prob=jsonObject.daily.data[i].precipProbability;
				var current_chance_of_rain=(parseFloat(precip_prob*100))+"%";
				//var current_windspeed=parseInt(jsonObject.daily.data[i].windSpeed);
				var current_dewpoint=parseInt(jsonObject.currently.dewPoint);
				var current_humidity = parseInt((jsonObject.daily.data[i].humidity) *100) +'%';
				//var current_visibility=parseInt(jsonObject.daily.data[i].visibility);
				
				if(degree == "si") 
                {
					current_temp+="&#176C";
					//current_windspeed+=" MS";
					current_dewpoint+="&#176C";
					//current_visibility+=" KM";
                    current_pressure = jsonObject.daily.data[i].pressure+" hPa";
                    
                var current_visibility =isNaN(jsonObject.daily.data[i].visibility)? 'NA': (jsonObject.daily.data[i].visibility).toFixed(2)+" KM";
				var current_windspeed = isNaN(jsonObject.daily.data[i].windSpeed)? 'NA' :(jsonObject.daily.data[i].windSpeed).toFixed(2)+" MS";
                    
                    
				} else {
					current_temp+="&#176C";
					//current_windspeed+=" MPH";
					current_dewpoint+="&#176F";
					//current_visibility+=" MI";
                    current_pressure = jsonObject.daily.data[i].pressure+" MB";
                var current_visibility =isNaN(jsonObject.daily.data[i].visibility)? 'NA':(jsonObject.daily.data[i].visibility).toFixed(2)+" MI";
				var current_windspeed = isNaN(jsonObject.daily.data[i].windSpeed)? 'NA' :(jsonObject.daily.data[i].windSpeed).toFixed(2)+" MPH";
                
				}

				var sunrise=jsonObject.daily.data[i].sunriseTime;
				var sunset=jsonObject.daily.data[i].sunsetTime;
				
				timezone=jsonObject.timezone;
				console.log(sunset);
				var inter_sunrise=moment.unix(sunrise);
				var final_sunrise=inter_sunrise.tz(timezone).format("hh:mm A");
				var inter_sunset=moment.unix(sunset);
				var final_sunset=inter_sunset.tz(timezone).format("hh:mm A");
				modalText="Weather in "+$('#city').val().trim()+" on "+monthDate;
				var id="#myModalLabel"+i;
				$(id).html(modalText);
                
				modalText="<div class='container-fluid'>\n<div class='row'><div class='col-md-12'><center><img height='150px' width='150px' src='"+icon+"' alt='"+current_summary+"' title='"+current_summary+"'></center></div></div>\n";
				
                modalText+="<div class='row'><div class='col-md-12'><h3><center>"+day+": <span style=\"color:#FFAB10\">"+current_summary+"<span></center></h3></div></div>\n";
				
                modalText+="<div class='row'><div class='col-md-4'><center><h4>Sunrise Time</h4>"+final_sunrise+"</center></div><div class='col-md-4'><center><h4>Sunset Time</h4>"+final_sunset+"</center></div><div class='col-md-4'><center><h4>Humidity</h4>"+current_humidity+"</center></div></div>\n";
				
                modalText+="<div class='row'><div class='col-md-4'><center><h4>Wind Speed</h4>"+current_windspeed+"</center></div><div class='col-md-4'><center><h4>Visibility</h4>"+current_visibility+"</center></div><div class='col-md-4'><center><h4>Pressure</h4>"+current_pressure+"</center><br></div></div>\n";
				
                modalText+="</div>"
                
                var id="#myModalBody"+i;
				$(id).html(modalText);
			}
		}
				 
		function getIcon(current_icon_name)
        {
			var icon;
            if(current_icon_name=="clear-day")
                icon="images/clear.png";
            else if(current_icon_name=="clear-night")
                icon="images/clear_night.png";    
            else if(current_icon_name=="clear-day")
                icon="images/clear.png";
            else if(current_icon_name=="rain")
                icon="images/rain.png";
            else if(current_icon_name=="snow")
                icon="images/snow.png";
            else if(current_icon_name=="sleet")
                icon="images/sleet.png";
            else if(current_icon_name=="wind")
                icon="images/wind.png";  
            else if(current_icon_name=="fog")
                icon="images/fog.png";
            else if(current_icon_name=="partly-cloudy-day")
                icon="images/cloud_day.png";
            else if (current_icon_name=="partly-cloudy-night")
                icon="images/cloud_night.png"; 
            else 
                icon="images/cloudy.png";
            
            return icon;
		  }
    
        function getPrecip(precipIntensity)
        {
            var precipName;
            
            if(precipIntensity < 0.002)
				precipName="None";
            else if(precipIntensity < 0.017 )
				precipName="Very Light";
			else if(precipIntensity < 0.1)
				precipName="Light";
			else if(precipIntensity < 0.4)
				precipName="Moderate";
			else if(precipIntensity >= 0.4)
				precipName="Heavy";
            return precipName
                        
        }

});
