<?php
                $url="";
                        $url = "https://maps.google.com/maps/api/geocode/xml?address=$_GET[address],$_GET[city],$_GET[state]"."&key=AIzaSyB573hyCU6J1TmqVG6p0TBgysRA2oarPd0";
                        $xmlfile = simplexml_load_file($url);
                        if($xmlfile->status != "OK"){
                                echo "XML not found";
                                return;
                        }
                        $latitude = $xmlfile->result->geometry->location->lat;
                        $longitude = $xmlfile->result->geometry->location->lng;
                        $units = $_GET["degree"];
                        $forecast = "https://api.forecast.io/forecast/9e7e6fc88eba0932906b935c15e3f93e/".$latitude.",".$longitude."?units=".$units."&exclude=flags";
                        $content = file_get_contents($forecast);
                        echo json_encode($content);
