<?php
                $url="";
<<<<<<< HEAD
                        $url = "https://maps.google.com/maps/api/geocode/xml?address=$_GET[address],$_GET[city],$_GET[state]"."&key=AIzaSyB573hyCU6J1TmqVG6p0TBgysRA2oarPd0";
=======
                        $url = "https://maps.google.com/maps/api/geocode/xml?address=$_GET[address],$_GET[city],$_GET[state]"."&key=API_KEY";
>>>>>>> a7b9188e10e9a59aac8a4dee2dd7963f73f6c774
                        $xmlfile = simplexml_load_file($url);
                        if($xmlfile->status != "OK"){
                                echo "XML not found";
                                return;
                        }
                        $latitude = $xmlfile->result->geometry->location->lat;
                        $longitude = $xmlfile->result->geometry->location->lng;
                        $units = $_GET["degree"];
<<<<<<< HEAD
                        $forecast = "https://api.forecast.io/forecast/9e7e6fc88eba0932906b935c15e3f93e/".$latitude.",".$longitude."?units=".$units."&exclude=flags";
=======
                        $forecast = "https://api.forecast.io/forecast/API_KEY/".$latitude.",".$longitude."?units=".$units."&exclude=flags";
>>>>>>> a7b9188e10e9a59aac8a4dee2dd7963f73f6c774
                        $content = file_get_contents($forecast);
                        echo json_encode($content);
