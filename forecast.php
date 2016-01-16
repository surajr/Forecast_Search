<?php
                $url="";
                        $url = "https://maps.google.com/maps/api/geocode/xml?address=$_GET[address],$_GET[city],$_GET[state]"."&key=API_KEY";
                        $xmlfile = simplexml_load_file($url);
                        if($xmlfile->status != "OK"){
                                echo "XML not found";
                                return;
                        }
                        $latitude = $xmlfile->result->geometry->location->lat;
                        $longitude = $xmlfile->result->geometry->location->lng;
                        $units = $_GET["degree"];
                        $forecast = "https://api.forecast.io/forecast/API_KEY/".$latitude.",".$longitude."?units=".$units."&exclude=flags";
                        $content = file_get_contents($forecast);
                        echo json_encode($content);
