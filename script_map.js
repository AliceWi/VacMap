    // import of object "dataMeasles" from measles050218.js
    // import of object "rotavirus" from rotaviren.js

    /**
    * reset of variables when changing to other dataset
    * @function initializationData
    * @param {string} datasetname variable name of dataset object
    * @param {object} datasetobj dataset object
    */
    function initializationData(datasetname, datasetobj){
        //firstTime
        firstTime = Object.getOwnPropertyNames(datasetobj).sort(function(a, b){return b-a});
        //secondTime
        secondTime = Object.getOwnPropertyNames(datasetobj[firstTime[0]]);
        //categories
        german ? (category1 = categoriesObj[datasetname].german.category1, category2 = categoriesObj[datasetname].german.category2) : (category1 = categoriesObj[datasetname].english.category1, category2 = categoriesObj[datasetname].english.category2);
        categories = [category1, category2];
        //check and empty
        check = {};
        empty = {};
            firstTime.forEach(function(d){
            check[d] = false;
            empty[d] = {};
        })
        secondTime.forEach(function(d){
            for(years in empty){
                empty[years][d] = {};
            }
        })
        for (cats in categories) {
            for(years in empty){
                for(args in empty[years]){
                    empty[years][args][categories[cats]] = false;
                }
            }
        }
        /** selected and displayed birth cohort, initialization: 2013 */
        selectedFirstTime = firstTime[0];
        /** selected and displayed age-group, initialization: 24 months */
        selectedSecondTime = ((datasetname == "rotavirus") ? secondTime[0] : secondTime[1]);
        /** selected and displayed category, initialization: first dose */
        selectedCategories = ((datasetname == "rotavirus") ? categories[1] : categories[1]);
        //rv
        rv = roundValue(datasetname, selectedSecondTime, selectedCategories);
        //ptv
        ptv = pathToValue(datasetobj, selectedFirstTime, selectedSecondTime);
    }

    /** gets the birth cohorts, reverse order (measles: 2013 to 2004; rotavirus: 2015,2014)  */
    var firstTime = Object.getOwnPropertyNames(datasetobj).sort(function(a, b){return b-a});
    /** contains the age-groups (measles: 15, 24, 36, 48, 60 and 72 months; rotavirus: 32 weeks) */
    var secondTime = Object.getOwnPropertyNames(datasetobj[firstTime[0]]);

    // language initialization: sets German/Englisch menu
    var jahrgang = (german? "Jahrgang" : "Birth cohort") , altersgruppe = (german? "Altersgruppe" : "Age-group") , kategorie = (german? "Kategorie" : "Category") ;

    /** contains names of the categories */
    var categoriesObj = {
        dataMeasles: {
            english: {
                category1: "First dose",
                category2: "Second dose"
            },
            german: {
                category1: "1. Impfung",
                category2: "2. Impfung"
            }
        },
        rotavirus: {
            english: {
                category1: "First dose",
                category2: "Fully vaccinated"
            },
            german: {
                category1: "1. Impfung",
                category2: "Vollständig geimpft"
            }
        }
    }
    german ? (category1 = categoriesObj[datasetname].german.category1, category2 = categoriesObj[datasetname].german.category2) : (category1 = categoriesObj[datasetname].english.category1, category2 = categoriesObj[datasetname].english.category2);
    var categories = [category1, category2];

    /**
    * to grey out non-used months in menu
    * @type {object}
    * @property {boolean} birth_cohorts gets true after data were checked if empty
    */
    var check = {};
    /**
    * to grey out non-used months in menu
    * @type {object}
    * @property {object} birth_cohorts 2004, 2005, etc.
    * @property {object} age-groups e.g. 24, properties of birth cohorts
    * @property {object} categories e.g. first dose, properties of age-groups
    * @property {boolean} first/second_dose properties of categories, true if no data
    */
    var empty = {};

    /*
    * initializes default values of the "check" and "empty" object
    */
    firstTime.forEach(function(d){
        check[d] = false;
        empty[d] = {};
    })

    /*
    * pushs the existing age groups into var secondTime
    * assigns age-groups as empty object to each birth cohort in the "empty" object
    */
    secondTime.forEach(function(d){
        for(years in empty){
            empty[years][d] = {};
        }
    })

    // assigns categories to each age-group in the "empty" object and set them to false as default value
    for (cats in categories) {
        for(years in empty){
            for(args in empty[years]){
                empty[years][args][categories[cats]] = false;
            }
        }
    }

    /** selected and displayed birth cohort, initialization: 2013 */
    var selectedFirstTime = firstTime[0];
    /** selected and displayed age-group, initialization: 24 months */
    var selectedSecondTime = ((datasetname == "rotavirus") ? secondTime[0] : secondTime[1]);
    /** selected and displayed category, initialization: first dose */
    selectedCategories = ((datasetname == "rotavirus") ? categories[1] : categories[1]);

    /**
    * = path to value. Shortcut to counties in "dataMeasles" object
    * @see pathToValue
    */
    var ptv = pathToValue(datasetobj, selectedFirstTime, selectedSecondTime);
    /**
    * = round value. Builds the name of the property to get the round value in the "dataMeasles" object, e.g. vac_mas1_15m_round (for measles)
    * @see roundValue
    */
    var rv = roundValue(datasetname, selectedSecondTime, selectedCategories);

    /** true if zoomed, initialization: no zoom */
    var zoomed = false;
    /** true if zoomed in ASHIP North Rhine or Westphalia-Lippe, for lkData() */
    var zoomedKv = false;

    var states, places, subunits;

    // todo: üöäß raus
    /** North Rhine-Westphalia has to KVs (Krankenkassenverband) = ASHIP */
    var nordrhein = d3.set(["LK Düren","LK Euskirchen","LK Heinsberg","LK Kleve","LK Mettmann","LK Oberbergischer Kreis","LK Rhein-Erft-Kreis","LK Rheinisch-Bergischer Kreis","LK Rhein-Kreis Neuss","LK Rhein-Sieg-Kreis","LK Viersen","LK Wesel","SK Bonn","SK Duisburg","SK Düsseldorf","SK Essen","SK Köln","SK Krefeld","SK Leverkusen","SK Mönchengladbach","SK Mülheim an der Ruhr","SK Oberhausen","SK Remscheid","SK Solingen","SK Wuppertal","LK Städteregion Aachen"]);
    var westfalenLippe = d3.set(["LK Borken","LK Coesfeld","LK Ennepe-Ruhr-Kreis","LK Gütersloh","LK Herford","LK Hochsauerlandkreis","LK Höxter","LK Lippe","LK Märkischer Kreis","LK Minden-Lübbecke","LK Olpe","LK Paderborn","LK Recklinghausen","LK Siegen-Wittgenstein","LK Soest","LK Steinfurt","LK Unna","LK Warendorf","SK Bielefeld","SK Bochum","SK Bottrop","SK Dortmund","SK Gelsenkirchen","SK Hagen","SK Hamm","SK Herne","SK Münster"]);

    /** number of top/worst county-bars displayed in the bar chart of the ranking of counties */
    var cutbarchart = 5;

    //appending table for menu to DOM
	  var box0 = d3.select("#sidebarLeft").append("table").attr("class", "table").attr("id", "firstTime");
    var box1 = d3.select("#sidebarLeft").append("table").attr("class", "table").attr("id", "secondTime");
    var box2 = d3.select("#sidebarLeft").append("table").attr("class", "table").attr("id", "categories");

    /** width of SVG containing the map */
    var width = 500;
    /** height of SVG containing the map */
    var height = 700;
    /** height of SVG containing the legend */
    var heightLegend = width/10;
    /** margin of legend */
    var margin = {right: 0, left: 20, top: 20, down: 0};

    /** dummy value for bar charts which do not need "classes" (but it is requested in the function makeBarCharts()). "classes" gets due to mouseover() for example ["subunit","Brandenburg"] */
    var classes = ["",""];
    var aships = ["",""];

    /** max. range/width of bars */
    var widthBars = 300;

    /**
    * color code for bar charts
    * @function colorBars
    * @param {int} number percentage
    */
    var colorBars = d3.scaleLinear().domain([0, 92, 100]).range(["#ff0000", "#fffee7", "#3182bd"]);

    // initialization of SVG: matches the sizes
    var legend = legend = d3.select("#bild").append("svg")
        .attr("id", "key")
        .attr("height", 50)
        .attr("width", 500)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 500 50");
    var svg = d3.select("#bild").append("svg")
        .attr("id", "map")
        .attr("height", 700)
        .attr("width", 500)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 500 700");

    legend.attr("height", heightLegend).attr("width", parseInt(d3.select("#map").style("width")));
    svg.attr("height", height).attr("width", parseInt(d3.select("#map").style("width")));

    // for map. geoAlbers projection
    var projection = d3.geoAlbers()
        .precision(0.6)
        .rotate([-10.4/180, 51.2/180]);

    /**
    * creates paths/polygons for map
    * @function path
    * @param {object} GeoJSON coordinates
    */
    var path = d3.geoPath()
        .projection(projection);

    /**
    * shortcut to counties in "dataMeasles" object
    * @function pathToValue
    * @param {object} dataset dataset without quotation marks
    * @param {string} selectedFirstTime birth cohort
    * @param {string} selectedSecondTime age-group
    */
    function pathToValue(dataset, selectedFirstTime, selectedSecondTime){
        var pathToValue = dataset[selectedFirstTime][selectedSecondTime].counties;
        return pathToValue;
    }

    /**
    * builds the name of the property to get the round value in the "dataMeasles" object, e.g. vac_mas1_15m_round
    * @function roundValue
    * @param {string} dataset dataset with quotation marks
    * @param {string} selectedSecondTime age-group
    * @param {string} selectedCategories category
    */
    function roundValue(dataset, selectedSecondTime, selectedCategories){
        if (dataset == "dataMeasles"){
            if(selectedCategories == category1){
                var masX = "mas1";
            }else{
                var masX = "mas2";
            }
            var XYm = selectedSecondTime.split(" ")[0];
            return "vc_" + masX + "_" + XYm + "m_round";
        }else if(dataset == "rotavirus"){
            if(selectedCategories == category1){
                var vc = "vc1";
            }else{
                var vc = "vc_compl";
            }
            return vc + "_round";
        }
    }

    /**
    * color code for map and legend
    * @function color
    * @param {int} number percentage
    * @see changeColor
    * @see changeColorBl
    */
    var color = function(number){
      if(datasetname == "dataMeasles"){
        var shift = 92;
      }else if(datasetname == "rotavirus"){
        var shift = 50;
      }
        if(number == null){
                return "grey";
        }else{
            colorScale = d3.scaleLinear().domain([0, shift, 100]).range(["#ff0000","#fffee7", "#3182bd"]);
            return colorScale(number);
        }
    };

    // JSON is asynchronous and needs d3.queue()
    d3.queue()
        .defer(d3.json, "germany_23_6_17_ohneBerlin.json")
        .await(showData);

    // for JSDoc
    /**
    * @class lokal
    */

    /**
    * @func showData
    * @param error error-first callback
    * @param {object} germany topoJSON object of Germany
    */
    function showData(error, germany) {
        if(error){console.log("error: "); throw error};

        /**
        * regionality button function. Switches between states and county representation.
        * @function blLkSwitch
        */
        function blLkSwitch(){

            /**
            * on mobile devices map is initially in state representation
            * @inner
            */
            var mq = window.matchMedia( "(min-width: 992px)" );
            if (mq.matches) {
                blPressed = 0;
            }else{
                blPressed = 1;
            }

            d3.selectAll(".switchBlLk")
                .on("click", function(){
                    d3.selectAll(".kv").interrupt(); // without it leads to a bug, if the second click is faster than the transition in changecolorkv

                    if(blPressed == 0 || blPressed == 1){
                        blPressed++;
                        if(blPressed == 1){
                            boxKV.selectAll(".kv").style("fill", "none").style("stroke", "none");
                            changeColorBl(selectedFirstTime, selectedSecondTime);
                            d3.select("#barchartkv").style("display", "none");
                            d3.select("#barchart0").style("display", "block");
                            d3.select("#titelBL").style("display", "block");
                            d3.select("#titelKV").style("display", "none");
                        }else if(blPressed == 2){
                            changeColorKv(selectedFirstTime, selectedSecondTime);
                            makeBarchart({}, {}, "#barchartKVPosition","barchartkv",orderedKv, orderedKv.length, "state", "ordered", 4);
                            d3.select("#barchart0").style("display", "none");
                            d3.select("#barchartkv").style("display", "block");
                            d3.select("#titelBL").style("display", "none");
                            d3.select("#titelKV").style("display", "block");
                        }
                    }else if(blPressed == 2){
                        blPressed = 0;
                        // there is a second and third map with state and kv representation above the map with the counties, so removing the filling leads to county representation
                        boxKV.selectAll(".kv").style("fill", "none").style("stroke", "none");
                        boxBL.selectAll(".states").style("fill", "none");
                        d3.select("#barchart0").style("display", "block");
                        d3.select("#barchartkv").style("display", "none");
                        d3.select("#titelBL").style("display", "block");
                        d3.select("#titelKV").style("display", "none");
                    }

                    if(zoomed){
                        d3.select("#barchartkv").style("display", "none");
                        d3.select("#barchart0").style("display", "none");
                        d3.select("#titelBL").style("display", "none");
                        d3.select("#titelKV").style("display", "none");
                    }

                    d3.selectAll(".polySelected").select("path").style("fill", "none");
                    setLangRepresentation();
                });
            setLangRepresentation();
            if(blPressed == 0){
                boxKV.selectAll(".kv").style("fill", "none").style("stroke", "none");
                boxBL.selectAll(".states").style("fill", "none");
                d3.select("#barchartkv").style("display", "none");
                d3.select("#barchart0").style("display", "block");
                d3.select("#titelBL").style("display", "block");
                d3.select("#titelKV").style("display", "none");
            }else if(blPressed == 1){
                boxKV.selectAll(".kv").style("fill", "none").style("stroke", "none");
                changeColorBl(selectedFirstTime, selectedSecondTime);
                d3.select("#barchartkv").style("display", "none");
                d3.select("#barchart0").style("display", "block");
                d3.select("#titelBL").style("display", "block");
                d3.select("#titelKV").style("display", "none");
            }else if(blPressed == 2){
                changeColorKv(selectedFirstTime, selectedSecondTime);
                d3.select("#barchart0").style("display", "none");
                d3.select("#barchartkv").style("display", "block");
                d3.select("#titelBL").style("display", "none");
                d3.select("#titelKV").style("display", "block");
                makeBarchart({}, {}, "#barchartKVPosition","barchartkv",orderedKv, orderedKv.length, "state", "ordered", 4);
            }
            if(zoomed){
                d3.select("#barchartkv").style("display", "none");
                d3.select("#barchart0").style("display", "none");
                d3.select("#titelBL").style("display", "none");
                d3.select("#titelKV").style("display", "none");
            }
            d3.selectAll(".polySelected").select("path").style("fill", "none");
        }

        /**
        * city labels button function. Hides/shows city lables.
        * @function stadtOnOffSwitch
        */
        function stadtOnOffSwitch(){
            stadtPressed = false;
            d3.selectAll(".switchStadt")
                .on("click", function(){
                    stadtPressed ? stadtPressed = false : stadtPressed = true;
                    if(stadtPressed){
                        d3.selectAll(".place-label").style("opacity", 0);
                        d3.select(".place").style("opacity", 0);
                   }else{
                        d3.selectAll(".place-label").style("opacity", 1);
                        d3.select(".place").style("opacity", 1);
                   }
                })
        }

// ======== map of Germany ========

        /**
        * geoJSON object of counties
        * @memberof lokal
        */
        subunits = topojson.feature(germany, germany.objects.counties);
        /**
        * geoJSON object of cities
        * @global
        */
        places = topojson.feature(germany, germany.objects.places);
        /**
        * geoJSON object of states
        * @memberof lokal
        */
        states = topojson.feature(germany, germany.objects.states);
        /**
        * geoJSON object of districts of berlin
        * @memberof lokal
        */
        berlin = topojson.feature(germany, germany.objects.berlin);
        /**
        * fusion of counties and districts of berlin/ subunits and berlin
        * @memberof lokal
        */
        featuresCB = [];
        for (var i = subunits.features.length - 1; i >= 0; i--) {
            featuresCB.push(subunits.features[i]);
        };
        for (var i = berlin.features.length - 1; i >= 0; i--) {
            featuresCB.push(berlin.features[i]);
        };
        /**
        * gives each state its English name, if any, otherwise null
        * @global
        */
        statesEnObj = {};
        for (var i = 0; i < states.features.length; i++) {
            statesEnObj[states.features[i].properties.name] = states.features[i].properties.nameEN;
        };

        statesEnObj["Nordrhein"] = "North Rhine";
        statesEnObj["Westfalen-Lippe"] = "Westphalia-Lippe";

        /** list of all counties of KV Nordrhein with belonging properties of germany object (with coordinates)*/
        nordrheinList = [];
        /** list of all counties of KV Westfalen-Lippe with belonging properties of germany object (with coordinates)*/
        westfalenLippeList = [];
        for (var i = 0; i < subunits.features.length; i++) {
            if(nordrhein.has(makePrefix(subunits.features[i]))){
                nordrheinList.push(subunits.features[i])
            }else if(westfalenLippe.has(makePrefix(subunits.features[i]))){
                westfalenLippeList.push(subunits.features[i])
            }
        };

        //coordinates of merged KV
        nmerge = topojson.merge(germany, germany.objects.counties.geometries.filter(function(d){return nordrhein.has(makePrefix(d))}));
        wmerge = topojson.merge(germany, germany.objects.counties.geometries.filter(function(d){return westfalenLippe.has(makePrefix(d))}));


    // initialization
        iniBuildSelectorTable();
        buildSelectorTable();
        orderLKs();
        scale2fit(path.bounds(states)); //fits the map to the SVG container
        orderBLs();
        meanDataBuilder();
        orderKVs();


        //framework for bar charts
        iniBarchart("#barchartMeanPosition", "barchartMean");
        iniBarchart("#barchart0Position", "barchart0");
        iniBarchart("#barchartKVPosition", "barchartkv");
        iniBarchart("#barchart1Position", "barchart1");
        iniBarchart("#barchart1BLPosition", "barchart1BL");
        iniBarchart("#barchart1KVPosition", "barchart1KV");
        iniBarchart("#barchart2Position", "barchart2");
        iniBarchart("#barchart2BLPosition", "barchart2BL");
        iniBarchart("#barchart2KVPosition", "barchart2KV");
        iniBarchart("#barchart3Position", "barchart3");
        iniBarchart("#barchart4Position", "barchart4");

        //makes "nationwide average" and "ranking of federal states" bar chart
        makeBarchart({}, {}, "#barchartMeanPosition","barchartMean",meanData, meanData.length, "state", "ordered", 4);
        makeBarchart({}, {}, "#barchart0Position","barchart0",orderedBl, orderedBl.length, "state", "ordered", 4);
        makeBarchart({}, {}, "#barchartKVPosition","barchartkv",orderedKv, orderedKv.length, "state", "ordered", 4);

        d3.selectAll(".polySelected").select("path").style("fill", "none");
        d3.select("#barchartMean").style("display", "block");
        d3.select("#barchart0").style("display", "block");
        d3.select("#barchartkv").style("display", "none");

        // language initialization: sets German/Englisch titles of static bar charts
        if(german){
            d3.select("#titelMean").html("Bundesweites Mittel");
            d3.select("#titelBL").html("Ranking Bundesländer");
            d3.select("#titelKV").html("Ranking Kassenärztliche Vereinigungen");
        }else{
            d3.select("#titelMean").html("Nationwide average");
            d3.select("#titelBL").html("Ranking of federal states");
            d3.select("#titelKV").html("Ranking of ASHIPs");
        }

    // map

        // there was a problem of overlapping polygons (and therefore unclean borders by hovering), so to hover an extra polygon is put on top of the map
        var origin = svg.append("g").attr("transform","translate("+(width/2)+","+height/2+")");
        var hover = svg.append("g").attr("transform","translate("+(width/2)+","+height/2+")");

        // there is a county layer (county representation) and on top a federal states layer (state representation), furthermore a layer for hovered counties and states respectively
        var box=origin.append("g").attr("class","box");
        var boxBL=origin.append("g").attr("class","box");
        var boxKV=origin.append("g").attr("class","box");
        var boxBLHover=hover.append("g").attr("class","box");
        var boxKVHover=hover.append("g").attr("class","box");
        var boxHover=hover.append("g").attr("class","box");

        var boxOn = box.selectAll(".subunit")
            .data(featuresCB)
          .enter().append("path")
            .attr("class",function(d){return "subunit " + d.properties.state;}) //state of county
            .attr("d", path)
            .attr("id", function(d){return d.id}); // id is 5 digit Community Identification Number of county

        // if VacMap is used via browser, it has click and double click events
        if(!isMobile.any()){
            boxOn
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
            .on("click", zoom)
            .on("dblclick", zoom);
        }

        // if VacMap is used via mobile devices, it has tap and long tap events
        if(isMobile.any()){
            var longpress = false;
            var presstimer = null;
            var longtarget = null;

            var cancel = function(e) {
                if (presstimer !== null) {
                    clearTimeout(presstimer);
                    presstimer = null;
                }

                this.classList.remove("longpress");
            };

            var click = function(e) {
                if (presstimer !== null) {
                    clearTimeout(presstimer);
                    presstimer = null;
                }

                this.classList.remove("longpress");

                if (longpress) {
                    return false;
                }

                mouseout(e);
                mouseover(e);
                mousemove(e);

            };

            var start = function(e) {

                if (e.type === "click" && e.button !== 0) {
                    return;
                }

                longpress = false;

                this.classList.add("longpress");

                if (presstimer === null) {
                    presstimer = setTimeout(function() {
                        zoom(e);
                        longpress = true;
                    }, 500);
                }

                return false;
            };

            boxOn
            .on("mousedown", start)
            .on("touchstart", start)
            .on("click", click)
            .on("mouseout", cancel)
            .on("touchend", cancel)
            .on("touchleave", cancel)
            .on("touchcancel", cancel);
        }

        /**
        * to avoid that city names get highlighted after double click
        * @todo Problem: You cannot copy-paste text anymore.
        * @func mousedown
        */
        document.addEventListener('mousedown', function (event) {
          if (event.detail > 1) { //if clicked more then once
            event.preventDefault(); // cancel event
          }
        }, false);

    // borders of states
        boxBL.selectAll(".states")
            .data(states.features)
          .enter().append("path")
            .attr("class", "states")
            .attr("id", function(d) {return d.properties.name; })
            .attr("d", path);

    // borders of KVs
        boxKV.selectAll(".kv.nordrhein")
            .data(new Array(1))
            .enter().append("path")
            .attr("class", "kv nordrhein")
            .attr("d", path(nmerge));

        boxKV.selectAll(".kv.westfalen-lippe")
            .data(new Array(1))
            .enter().append("path")
            .attr("class", "kv westfalen-lippe")
            .attr("d", path(wmerge));

    // initialization that happens after creating the map
        blLkSwitch();
        stadtOnOffSwitch();

        // coloring
        box.selectAll(".subunit").style("fill", function(d){return color(ptv[d.id][rv]);});

    // divs for tooltip for county and state representation
    var tip = d3.select("body").append("div")
        .attr("id", "LkTooltip")
        .attr("class", "tooltips")
        .style("display", "none");
    var tipBl = d3.select("body").append("div")
        .attr("id", "BlTooltip")
        .attr("class", "tooltips")
        .style("display", "none");

    var tipKv = d3.select("body").append("div")
        .attr("id", "KvTooltip")
        .attr("class", "tooltips")
        .style("display", "none");

        /**
        * @func mouseover
        * @param {object} d datum of topoJSON object
        */
        function mouseover(d) {

            // shows bar charts title
            d3.select("#blTitel").style("display", "block");
            d3.select("#titelJG").style("display", "block");
            d3.select("#titelAG").style("display", "block");

            // shows tooltip and other bar charts title for county or state representation
            if(blPressed == 0){
                tip.style("display", "inline");
                tipBl.style("display", "none");

                d3.select("#lkTitel").style("display", "block");
                d3.select("#barchart1").style("display", "block");
                d3.select("#barchart2").style("display", "block");
                d3.select("#barchart1BL").style("display", "none");
                d3.select("#barchart2BL").style("display", "none");
                d3.select("#barchart1KV").style("display", "none");
                d3.select("#barchart2KV").style("display", "none");
            }else if(blPressed == 1){
                tip.style("display", "none");
                tipBl.style("display", "inline");

                d3.select("#lkTitel").style("display", "none");
                d3.select("#barchart1").style("display", "none");
                d3.select("#barchart2").style("display", "none");
                d3.select("#barchart1BL").style("display", "block");
                d3.select("#barchart2BL").style("display", "block");
                d3.select("#barchart1KV").style("display", "none");
                d3.select("#barchart2KV").style("display", "none");
            }else if(blPressed == 2){
                tip.style("display", "none");
                tipBl.style("display", "inline");

                d3.select("#lkTitel").style("display", "none");
                d3.select("#barchart1").style("display", "none");
                d3.select("#barchart2").style("display", "none");
                d3.select("#barchart1BL").style("display", "none");
                d3.select("#barchart2BL").style("display", "none");
                d3.select("#barchart1KV").style("display", "block");
                d3.select("#barchart2KV").style("display", "block");
            }

            // if zoomed it shows the titles of the specific bar charts, which replace the ranking of the states, and the three dots between them
            if(zoomed){
                d3.select("#barchart3").style("display", "block");
                d3.select("#barchart4").style("display", "block");
                d3.selectAll(".circles").style("display", "block");
                d3.select("#titel3").style("display", "block");
            }else{
                if(blPressed == 0 || blPressed == 1){
                    d3.select("#barchart0").style("display", "block");
                    d3.select("#barchartkv").style("display", "none");
                }else{
                    d3.select("#barchart0").style("display", "none");
                    d3.select("#barchartkv").style("display", "block");
                }
            }

            // if one hovers over greyed areas, there are no bar charts shown
            if(!isMobile.any()){
                if(this.style["fill"] == "grey" || this.style["fill"] == "rgb(128, 128, 128)"){
                    d3.select("#lkTitel").style("display", "none");
                    d3.select("#blTitel").style("display", "none");
                    d3.select("#titelJG").style("display", "none");
                    d3.select("#titelAG").style("display", "none");
                    d3.select("#titel3").style("display", "none");
                    d3.select("#barchart1").style("display", "none");
                    d3.select("#barchart2").style("display", "none");
                    d3.select("#barchart1BL").style("display", "none");
                    d3.select("#barchart2BL").style("display", "none");
                    d3.select("#barchart1KV").style("display", "none");
                    d3.select("#barchart2KV").style("display", "none");
                    d3.select("#barchart3").style("display", "none");
                    d3.select("#barchart4").style("display", "none");
                    d3.selectAll(".circles").style("display", "none");
                }
            }

            // sets classes, e.g. ["subunit", "Hessen"]
            if(!isMobile.any()){
                classes = this.className.baseVal.split(" ");
                aships = classes;
                if(classes[1] == "Nordrhein-Westfalen"){
                    for (var i = 0; i < nordrheinList.length; i++) {
                        if(nordrheinList[i].id == this.id){
                            aships = ["subunit", "Nordrhein"];
                        }
                    };
                    for (var i = 0; i < westfalenLippeList.length; i++) {
                        if(westfalenLippeList[i].id == this.id){
                            aships = ["subunit", "Westfalen-Lippe"];
                        }
                    };
                }
            }else{
                classes = ["subunit", d.properties.state];
                aships = classes;
                if(classes[1] == "Nordrhein-Westfalen"){
                    for (var i = 0; i < nordrheinList.length; i++) {
                        if(nordrheinList[i].id == d.id){
                            aships = ["subunit", "Nordrhein"];
                        }
                    };
                    for (var i = 0; i < westfalenLippeList.length; i++) {
                        if(westfalenLippeList[i].id == d.id){
                            aships = ["subunit", "Westfalen-Lippe"];
                        }
                    };
                }
            }

            // hover state
            for(var j = 0; j < states.features.length; j++){
                if(blPressed == 1 || blPressed == 0){
                    if(states.features[j].properties.name === classes[1]){
                        d3.select(".blhovered").remove();
                        boxBLHover.datum(states.features[j]).append("path").attr("class", "blhovered").attr("d", path); // hover as new polygon on top of the map to avoid unclean borders
                        if(!zoomed){
                            d3.select(".blhovered").style("stroke-width", 2);
                        }else{
                            d3.select(".blhovered").style("stroke-width", 2/scalefactor); //stroke gets thinner in zoom mode
                        }
                    }
                }else if(blPressed == 2){
                    if(states.features[j].properties.name === classes[1] && states.features[j].properties.name !== "Nordrhein-Westfalen"){
                        d3.select(".blhovered").remove();
                        boxBLHover.datum(states.features[j]).append("path").attr("class", "blhovered").attr("d", path); // hover as new polygon on top of the map to avoid unclean borders
                        if(!zoomed){
                            d3.select(".blhovered").style("stroke-width", 2);
                        }else{
                            d3.select(".blhovered").style("stroke-width", 2/scalefactor); //stroke gets thinner in zoom mode
                        }
                     }
                }
            };

            //hides last triangle on the left of the bar
            d3.selectAll(".polySelected").attr("class", "polygon");
            //shows little triangle on the left of the belonging bar
            if(blPressed == 0 || blPressed == 1){
                d3.select("#poly"+classes[1]).attr("class", "polySelected polygon");
            }else if(blPressed == 2){
                d3.select("#kvpoly"+aships[1]).attr("class", "polySelected polygon");
            }
            d3.selectAll(".polySelected").select("path").style("fill", "black");

            // hover county
            if(blPressed == 0){
                for(var j = 0; j < featuresCB.length; j++){
                    if((!isMobile.any() && featuresCB[j].id == this.id) || (isMobile.any() && featuresCB[j].id == d.id)){
                        d3.select(".hovered").remove();
                        boxHover.datum(featuresCB[j]).append("path").attr("class", "hovered").attr("d", path);
                        if(!zoomed){
                            d3.select(".hovered").style("stroke-width", 1.5);
                        }else{
                            d3.select(".hovered").style("stroke-width", 1.5/scalefactor);
                        }
                    }
                };
            }
            else if(blPressed == 2){
                for (var i = 0; i < subunits.features.length; i++) {
                    if((!isMobile.any() && (subunits.features[i].id === this.id && nordrhein.has(makePrefix(subunits.features[i])))) || (isMobile.any() && (subunits.features[i].id === d.id && nordrhein.has(makePrefix(subunits.features[i])))) ){
                        d3.select(".blhovered").remove();
                        boxKVHover.data(new Array(1)).append("path").attr("class", "blhovered").attr("d", path(nmerge));
                        if(!zoomed){
                            d3.select(".blhovered").style("stroke-width", 2);
                        }else{
                            d3.select(".blhovered").style("stroke-width", 2/scalefactor); //stroke gets thinner in zoom mode
                        }
                    }else if((!isMobile.any() && (subunits.features[i].id === this.id && westfalenLippe.has(makePrefix(subunits.features[i])))) || (isMobile.any() && (subunits.features[i].id === d.id && westfalenLippe.has(makePrefix(subunits.features[i]))))){
                        d3.select(".blhovered").remove();
                        boxKVHover.data(new Array(1)).append("path").attr("class", "blhovered").attr("d", path(wmerge));
                        if(!zoomed){
                            d3.select(".blhovered").style("stroke-width", 2);
                        }else{
                            d3.select(".blhovered").style("stroke-width", 2/scalefactor); //stroke gets thinner in zoom mode
                        }
                    }
                };
            }

    // ======barcharts======


        if(!isMobile.any()){
            if(ptv[this.id][rv] !== undefined){
                createBarcharts();
        }
        }else{
            createBarcharts();
        }

            /**
            * calls makeBarchart() for the particular situation. Creates them, zoom() displays or hides them
            * @func createBarcharts
            */
            function createBarcharts(){

                // bar charts for age-group and birth cohort in county representation
                makeBarchart(d, featuresCB, "#barchart1Position","barchart1",firstTimeData(d, selectedCategories), firstTimeData(d, selectedCategories).length, "Altersgruppe", "value", 1);
                makeBarchart(d, featuresCB, "#barchart2Position","barchart2",secondTimeData(d, selectedCategories), secondTimeData(d, selectedCategories).length, "Jahrgang", "value", 2);
                // bar charts for age-group and birth cohort in state representation
                makeBarchart(d, featuresCB, "#barchart1BLPosition","barchart1BL",firstTimeDataBL(classes[1], selectedCategories), firstTimeDataBL(classes[1], selectedCategories).length, "Altersgruppe", "value", 1);
                makeBarchart(d, featuresCB, "#barchart2BLPosition","barchart2BL",secondTimeDataBL(classes[1], selectedCategories), secondTimeDataBL(classes[1], selectedCategories).length, "Jahrgang", "value", 2);
                // bar charts for age-group and birth cohort in kv representation
                makeBarchart(d, featuresCB, "#barchart1KVPosition","barchart1KV",firstTimeDataKV(aships[1], selectedCategories), firstTimeDataKV(aships[1], selectedCategories).length, "Altersgruppe", "value", 1);
                makeBarchart(d, featuresCB, "#barchart2KVPosition","barchart2KV",secondTimeDataKV(aships[1], selectedCategories), secondTimeDataKV(aships[1], selectedCategories).length, "Jahrgang", "value", 2);


                    // for the ranking of the top and worst 5 (=cutbarchart) counties when zoomed. If state has equal/less than 10 counties, all counties are shown
                    if(lkData().length < 2*cutbarchart){
                        makeBarchart(d, featuresCB, "#barchart3Position","barchart3",lkData(), numberLK(), "lk", rv, 3);
                        d3.select("#barchart4").style("display", "none");
                        d3.selectAll(".circles").style("display", "none");
                    }
                    // 3 points shown in county ranking when zoomed
                    else{
                        d3.selectAll(".circles").remove();
                        var worstLk = lkData().slice(cutbarchart,lkData().length);
                        var topLk = lkData().slice(0,cutbarchart);
                        makeBarchart(d, featuresCB, "#barchart3Position","barchart3",topLk, cutbarchart, "lk", rv, 3); // top 5 counties

                        var svgCircles =  d3.select("#circlesPosition").append("g")
                            .attr("class", "circles")
                            .append("svg")
                            .attr("width", 100)
                            .attr("height", 12)
                            .attr("preserveAspectRatio", "xMidYMid meet")
                            .attr("viewBox", "0 0 " + d3.select("#sidebarRight").style("width").split("px")[0] + " 12")
                            .append("g")
                            .attr("transform", "translate(0,0)");

                        var circles3 = [{"cx": 30, "cy":2 , "r": 1, "color": "black"},
                                    {"cx": 30, "cy":6 , "r": 1, "color": "black"},
                                    {"cx": 30, "cy":10 , "r": 1, "color": "black"}];

                        var circles = svgCircles.selectAll("circle")
                                                  .data(circles3)
                                                  .enter()
                                                  .append("circle");

                        var circleAttributes = circles
                                               .attr("cx", function (d) { return d.cx; })
                                               .attr("cy", function (d) { return d.cy; })
                                               .attr("r", function (d) { return d.r; })
                                               .style("fill", function(d) { return d.color; });
                        circleAttributes.attr("transform","translate(0,0)");

                        makeBarchart(d, featuresCB, "#barchart4Position","barchart4",worstLk, cutbarchart, "lk", rv, 3); // worst 5 counties
                    }
                if(!zoomed){
                    d3.select("#titel3").style("display", "none");
                    d3.selectAll(".circles").style("display", "none");
                }
            }

        }

        function mousemove(d) {

        // tooltip
            var text, textBl, blName;

            if(ptv[d.id][rv] == null){
                if(german){
                    var text = "<br/>keine Daten";
                }else{
                    var text = "<br/>no data";
                }

            } else{
                if(german){
                    var text = "<br/>Impfquote: " + parseFloat(ptv[d.id][rv]).toFixed(1) + "%";
                }else{
                    var text = "<br/>Vaccination coverage: " + ptv[d.id][rv] + "%";
                }
            }

            if(datasetobj[selectedFirstTime][selectedSecondTime].states[d.properties.state][rv] == null){
                if(german){
                    var textBl = "<br/>keine Daten";
                }else{
                    var textBl = "<br/>no data";
                }
            } else{
                if(german){
                    var textBl = "<br/>Impfquote: " + parseFloat(datasetobj[selectedFirstTime][selectedSecondTime].states[d.properties.state][rv]).toFixed(1) + "%";
                    if(blPressed == 2 ){

                        for (var i = 0; i < nordrheinList.length; i++) {
                            if(nordrheinList[i].id == this.id){
                                var textBl = "<br/>Impfquote: " + parseFloat(datasetobj[selectedFirstTime][selectedSecondTime].kv["Nordrhein"][rv]).toFixed(1) + "%";

                            }
                        };
                        for (var i = 0; i < westfalenLippeList.length; i++) {
                            if(westfalenLippeList[i].id == this.id){
                                var textBl = "<br/>Impfquote: " + parseFloat(datasetobj[selectedFirstTime][selectedSecondTime].kv["Westfalen-Lippe"][rv]).toFixed(1) + "%";

                            }
                        };
                    }
                }else{
                    var textBl = "<br/>Vaccination coverage: " + parseFloat(datasetobj[selectedFirstTime][selectedSecondTime].states[d.properties.state][rv]).toFixed(1) + "%";
                    if(blPressed == 2){

                        for (var i = 0; i < nordrheinList.length; i++) {
                            if(nordrheinList[i].id == this.id){
                                var textBl = "<br/>Vaccination coverage: " + parseFloat(datasetobj[selectedFirstTime][selectedSecondTime].kv["Nordrhein"][rv]).toFixed(1) + "%";
                              }
                        };
                        for (var i = 0; i < westfalenLippeList.length; i++) {
                            if(westfalenLippeList[i].id == this.id){
                                var textBl = "<br/>Vaccination coverage: " + parseFloat(datasetobj[selectedFirstTime][selectedSecondTime].kv["Westfalen-Lippe"][rv]).toFixed(1) + "%";

                            }
                        };
                    }
                }
            }

            blName =  german ? d.properties.state : (statesEnObj[d.properties.state] === null ? d.properties.state : statesEnObj[d.properties.state]);

            if((blPressed == 2 && (blName == "Nordrhein-Westfalen" || blName == "North Rhine-Westphalia"))||((blPressed == 1 || blPressed == 0) && zoomedKv && (blName == "Nordrhein-Westfalen" || blName == "North Rhine-Westphalia"))){
                for (var i = 0; i < nordrheinList.length; i++) {
                    if((!isMobile.any() && nordrheinList[i].id == this.id) || (isMobile.any() && nordrheinList[i].id == d.id)){
                        german ? blName = "Nordrhein" : blName = "North Rhine";
                    }
                };
                for (var i = 0; i < westfalenLippeList.length; i++) {
                    if((!isMobile.any() && westfalenLippeList[i].id == this.id) || (isMobile.any() && westfalenLippeList[i].id == d.id)){
                        german ? blName =  "Westfalen-Lippe" : blName = "Westphalia-Lippe";
                    }
                };
            }

            tip.html(blName + "</br>" + "<b>" + makePrefix(d) + "</b>" + " (" + d.properties.kfz + ")" + text)
                .style("left", d3.event.pageX - document.getElementById("LkTooltip").offsetWidth/2 + "px")
                .style("top", d3.event.pageY - 85 + "px");

            if(!zoomedKv && (blPressed == 1 || blPressed == 0)){
                var prefix = "";
            }else if(blPressed == 2 || zoomedKv){
                if(german){
                    var prefix = "KV ";
                }else{
                    var prefix = "ASHIP ";
                }
            }
            tipBl.html( "<b>" + prefix + blName + "</b>" + textBl)
                .style("left", d3.event.pageX - document.getElementById("BlTooltip").offsetWidth/2 + "px")
                .style("top", d3.event.pageY - 75 + "px");

            // BL, KV bold or not bold
            if(blPressed == 1 || blPressed == 2){
                d3.select("#blTitel").html("<b>" + prefix + blName + "</b>");
            }else if(blPressed == 0){
                d3.select("#blTitel").html(prefix + blName);
            }

            d3.select("#lkTitel").html("<b>" + makePrefix(d) + "</b>" + " (" + d.properties.kfz + ")");

            var languageMonth;
            languageMonth = (datasetname == "dataMeasles") ? (german ? " Monate" : " months") : (german ? " Wochen" : " weeks")

            if(german){
                d3.select("#titelJG").html("Jahrgang: " + selectedFirstTime + "</b>");
                d3.select("#titelAG").html("Altersgruppe: " + selectedSecondTime + languageMonth);
                d3.select("#titel3").html("Ranking Landkreise von " + prefix +blName);
            }else{
                d3.select("#titelJG").html("Birth cohort: " + selectedFirstTime + "</b>");
                d3.select("#titelAG").html("Age-group: " + selectedSecondTime + languageMonth);
                d3.select("#titel3").html("Ranking of counties of " + prefix +blName);
            }
        }

        function mouseout(d) {

            if(isMobile.any()){ // mobile devices have no mouseover() and therefore classes is not defined
                classes = ["subunit", d.properties.state]; // e.g. ["subunit", "Hessen"]
            }

            tip.style("display", "none");
            tipBl.style("display", "none");
            d3.select(".hovered").style("display", "none");
            d3.select(".blhovered").style("display", "none");
            d3.select("#barchart1").style("display", "none");
            d3.select("#barchart2").style("display", "none");
            d3.select("#barchart1BL").style("display", "none");
            d3.select("#barchart2BL").style("display", "none");
            d3.select("#barchart1KV").style("display", "none");
            d3.select("#barchart2KV").style("display", "none");
            d3.select("#barchart3").style("display", "none");
            d3.select("#barchart4").style("display", "none");
            d3.selectAll(".circles").style("display", "none");
            d3.selectAll(".polySelected").select("path").style("fill", "none");
            d3.select("#blTitel").style("display", "none");
            d3.select("#lkTitel").style("display", "none");
            d3.select("#titelJG").style("display", "none");
            d3.select("#titelAG").style("display", "none");
            d3.select("#titel3").style("display", "none");
            //d3.select("#"+classes[1]).style("stroke","grey"); //hier, weiß nicht, obs nötig ist
            // if(!zoomed){
            //     d3.select("#"+classes[1]).style("stroke-width", 0.7); //hier, weiß nicht, obs nötig ist
            // }
        }

        /**
        * called if click(). Focuses clicked states. Shows/hides already created bar charts.
        * @func zoom
        * @param {object} d topoJSON object
        * @todo non-focused states should have a lower opacity, but with that the county map is shining through
        * @todo remove error thrown on mobile devices because they have no mouseover()
        */
        function zoom(d){
            clickedLK = d; //for bllkswitch()

            if(isMobile.any()){ // mobile devices have no mouseover() and therefore classes is not defined
                classes = ["subunit", d.properties.state]; // e.g. ["subunit", "Hessen"]
            }

            zoomed ? zoomed = false : zoomed = true;
            if(zoomed){
                zoomedKv = false;
                zoomedStateKV = false;

                d3.select("#barchart0").style("display", "none");
                d3.select("#barchartkv").style("display", "none");
                d3.select("#titelBL").style("display", "none");
                d3.select("#titelKV").style("display", "none");
                d3.select("#titel3").style("display", "block");

                if(lkData().length < 2*cutbarchart){
                    d3.select("#barchart3").style("display", "block");
                }else{
                    d3.select("#barchart3").style("display", "block");
                    d3.selectAll(".circles").style("display", "block");
                    d3.select("#barchart4").style("display", "block");
                }

                if(blPressed == 2 && nordrhein.has(makePrefix(d))){
                    zoomedKv = true;
                    nordrheinstate = {};
                    nordrheinstate.type="FeatureCollection";
                    nordrheinstate.features = [{}];
                    nordrheinstate.features[0].geometry = {coordinates: nmerge.coordinates[0]};
                    nordrheinstate.features[0].geometry.type = "Polygon";
                    nordrheinstate.features[0].id = "05";
                    nordrheinstate.features[0].properties = {name: "Nordrhein", nameEN:"North Rhine", short:"N"};
                    nordrheinstate.features[0].type = "Feature";
                    thisstate = nordrheinstate;
                    zoomedStateKV = "Nordrhein";
                }else if(blPressed == 2 && westfalenLippe.has(makePrefix(d))){
                    zoomedKv = true;
                    westfalenstate = {};
                    westfalenstate.type="FeatureCollection";
                    westfalenstate.features = [{}];
                    westfalenstate.features[0].geometry = {coordinates: wmerge.coordinates[0]};
                    westfalenstate.features[0].geometry.type = "Polygon";
                    westfalenstate.features[0].id = "05";
                    westfalenstate.features[0].properties = {name: "Westfalen-Lippe", nameEN:"Westphalia-Lippe", short:"W"};
                    westfalenstate.features[0].type = "Feature";
                    thisstate = westfalenstate;
                    zoomedStateKV = "Westfalen-Lippe";
                }else{
                    var thisstate = {};
                    thisstate.type="FeatureCollection";
                    thisstate.features = states.features.filter(function(x){return d.properties.state==x.properties.name ? 1 : 0});
                }

                bb = path.bounds(states); // bounding box of Germany
                bbstate = path.bounds(thisstate); // bounding box of focused state
                zoomedState = d.properties.state;

                x0 = 0.5*(bbstate[0][0]+bbstate[1][0]);
                y0 = 0.5*(bbstate[0][1]+bbstate[1][1]);

                lx = Math.abs(bbstate[1][0]-bbstate[0][0]);
                ly = Math.abs(bbstate[1][1]-bbstate[0][1]);

                lxs = Math.abs(bb[1][0]-bb[0][0]);
                lys = Math.abs(bb[1][1]-bb[0][1]);

                scalefactor= lxs/lx > lys/ly ? lys/ly : lxs/lx; // orientates on greatest length, so nothing overlaps

                //zoom borders
                d3.selectAll(".box").transition().duration(1000).attr("transform","scale("+scalefactor+")translate("+(-x0)+","+(-y0)+")");
                //zoom counties
                d3.selectAll(".subunit").transition().duration(1000)
                .style("opacity", function(x){
                    if(zoomedKv){
                        if((zoomedStateKV == "Nordrhein" && nordrhein.has(makePrefix(x))) || (zoomedStateKV == "Westfalen-Lippe" && westfalenLippe.has(makePrefix(x)))){
                            return 1;
                        }else{
                            return 0.1;
                        }
                    }else{
                        return d.properties.state==x.properties.state ? 1 : .1
                    }
                });

                /**
                * @todo non-focused states should have a lower opacity, but with that the county map is shining through
                */
                // d3.selectAll(".states")
                // .style("opacity", function(x){
                //     return d.properties.state==x.properties.name ? 1 : .1
                // });

                d3.selectAll(".subunit-boundary").transition().duration(1000).style("stroke-width", .5/scalefactor);
                d3.selectAll(".states").transition().duration(1000).style("stroke-width", .7/scalefactor); //hier
                /**
                * throws error on mobile devices because they have no mouseover()
                * @todo remove error
                */
                //d3.select("#"+classes[1]).transition().duration(1000).style("stroke-width", .7/scalefactor); //hier, weiß nicht, obs nötig ist

                makeCircles(path); // circles of cities
                changeFontSizePlaces(); // font size of city names

                // during zoom in/out, city names and their circles are hidden
                d3.selectAll(".place-label").style("display", "none");
                d3.select(".place").style("display", "none");
                setTimeout(function(){
                    d3.selectAll(".place-label").style("display", "inline");
                    d3.selectAll(".place").style("display", "inline");

                    // if zoom with state representation, map switches to county representation
                    blPressed = 0;
                    d3.selectAll(".states").style("fill", "none");
                    d3.selectAll(".kv").style("fill", "none");
                    d3.select("#Landkreise").attr("class", "selectedButton");
                    d3.select("#Bundesländer").attr("class", "button");
                }, 1000)

                // for representation info box under map
                blPressed = 0;
                setLangRepresentation();

            } else {
                zoomedKv = false;

                d3.select("#barchart3").style("display", "none");
                d3.select("#barchart4").style("display", "none");
                d3.select("#titel3").style("display", "none");
                d3.selectAll(".circles").style("display", "none");
                if(blPressed == 0 || blPressed == 1){
                    d3.select("#barchart0").style("display", "block");
                    d3.select("#barchartkv").style("display", "none");
                    d3.select("#titelBL").style("display", "block");
                    d3.select("#titelKV").style("display", "none");
                }else{
                    d3.select("#barchart0").style("display", "none");
                    d3.select("#barchartkv").style("display", "block");
                    d3.select("#titelKV").style("display", "block");
                    d3.select("#titelBL").style("display", "none");
                }


                //zoom borders
                d3.selectAll(".box").transition().duration(1000).attr("transform","scale(1)translate(0,0)");
                //zoom counties
                d3.selectAll(".subunit").transition().duration(1000)
                .style("opacity", 1);

                d3.selectAll(".subunit-boundary").transition().duration(1000).style("stroke-width", .5);
                d3.selectAll(".states").transition().duration(1000).style("stroke-width", .7);

                makeCircles(path);
                changeFontSizePlaces();

                d3.selectAll(".place-label").style("display", "none");
                d3.selectAll(".place").style("display", "none");
                setTimeout(function(){
                    d3.selectAll(".place-label").style("display", "inline");
                    d3.selectAll(".place").style("display", "inline");
                }, 1000)

                // for representation info box under map
                setLangRepresentation();

            }
        }

        /**
        * fits the map into the SVG container
        * @func scale2fit
        * @param {array} b boundary box
        */
        function scale2fit(b) {
            var w = width;//500
            var h = height;//700
            var s0 = projection.scale();
            var t0 = projection.translate();

            s = s0 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h); //orientiert sich an größter Länge, damit nichts übersteht
            t = [   - s / s0 * ( (b[1][0] + b[0][0]) / 2  - t0[0]),   - s / s0 * ((b[1][1] + b[0][1]) / 2 - t0[1])]; // falls w>h, dann ist x-Verschiebung 0.5w (und h relativ), ansonsten y-Verschiebung 0.5h (und w relativ)
            projection.translate(t).scale(s);
        }

        /**
        * Makes boundaries. topojson.mesh converts TopoJSON back to GeoJSON because d3.geoPath() (in pathName) needs GeoJSON
        * @func makeBoundaries
        * @pathName {function} pathName path function
        * @see path
        */
        function makeBoundaries(pathName){
            //hier zusammenfassen
            box.append("path")
                .datum(topojson.mesh(germany, germany.objects.counties, function(a,b) { if (a!==b){return a;}}))
                .attr("class", "subunit-boundary")
                .attr("d", pathName);

            box.append("path")
                .datum(topojson.mesh(germany, germany.objects.berlin, function(a,b) { if (a!==b){return a;}}))
                .attr("class", "subunit-boundary")
                .attr("d", pathName);

            box.append("path")
                .datum(topojson.mesh(germany, germany.objects.counties, function(a,b) { if (a===b){return a;}}))
                .attr("class", "boundary")
                .attr("d", pathName);

            box.append("path")
                .datum(topojson.mesh(germany, germany.objects.berlin, function(a,b) { if (a===b){return a;}}))
                .attr("class", "boundary")
                .attr("d", pathName);

            // KV boundaries
            // boxKV.append("path")
            //     .datum(topojson.merge(germany, germany.objects.counties.geometries.filter(function(d){
            //         return nordrhein.has(makePrefix(d))
            //     })))
            //     .attr("class", "kv-subunit-boundary nordrhein")
            //     .attr("d", pathName);

            // boxKV.append("path")
            //     .datum(topojson.merge(germany, germany.objects.counties.geometries.filter(function(d){
            //         return westfalenLippe.has(makePrefix(d))
            //     })))
            //     .attr("class", "kv-subunit-boundary westfalen-lippe")
            //     .attr("d", pathName);

        }

        /**
        * initialization of city circles
        * @func makeCirclesIni
        * @param {function} pathName path function
        * @see path
        */
        function makeCirclesIni(pathName){

            path.pointRadius(3);

            boxKV.datum(places)
                .append("path")
                .attr("class", "place")
                .attr("d", pathName);

        }

        /**
        * to fit circle size and to transfer them to new position
        * @func makeCircles
        * @param {function} pathName path function
        * @see path
        */
        function makeCircles(pathName){

            if(zoomed){
                path.pointRadius(3/scalefactor);
            }else{
                path.pointRadius(3);
            }

            d3.selectAll("path.place")
                .datum(places)
                .attr("d", pathName);

        }

        /**
        * makes city names, but the text itself is set with setLangPlaces()
        * @func makePlaces
        * @see setLangPlaces
        */
        function makePlaces(){
            boxKV.selectAll(".place-label")
                .data(places.features)
              .enter().append("text")
                .attr("class", "place-label")
                .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
                .attr("dy", ".35em")
                .attr("x", function(d) {
                    if(d.properties.name === "Duisburg" || d.properties.name === "Düsseldorf" || d.properties.name === "Oldenburg" || d.properties.name === "Wiesbaden" || d.properties.name === "Mannheim" || d.properties.name === "Nürnberg" || d.properties.name === "Ulm" || d.properties.name === "Osnabrück" || d.properties.name === "Magdeburg" || d.properties.name === "Hannover" || d.properties.name === "Augsburg" || d.properties.name === "Chemnitz" || d.properties.name === "Gera"){
                       return d.geometry.coordinates[0] > 10 ? 6 : -6;
                    }else{return d.geometry.coordinates[0] > 10 ? -6 : 6; } })
                .attr("y", function(d) {
                    if(d.properties.name === "Braunschweig" || d.properties.name === "Jena"){
                        return -10;
                    }
                })
                .style("text-anchor", function(d) {
                    if(d.properties.name === "Duisburg" || d.properties.name === "Düsseldorf" || d.properties.name === "Oldenburg" || d.properties.name === "Wiesbaden"|| d.properties.name === "Mannheim" || d.properties.name === "Nürnberg" || d.properties.name === "Ulm" || d.properties.name === "Osnabrück" || d.properties.name === "Magdeburg" || d.properties.name === "Hannover" || d.properties.name === "Braunschweig" || d.properties.name === "Augsburg" || d.properties.name === "Chemnitz" || d.properties.name === "Gera" || d.properties.name === "Jena"){
                       return d.geometry.coordinates[0] > 10 ? "start" : "end";
                    }else{return d.geometry.coordinates[0] > 10 ? "end" : "start"; }});
        }

        /**
        * changes the font size when zoom out/in
        * @func changeFontSizePlaces
        * @see zoom
        */
        function changeFontSizePlaces(){
            if(zoomed){
                d3.selectAll(".place-label")
                    .attr("x", function(d) {
                        if(d.properties.name === "Duisburg" || d.properties.name === "Düsseldorf" || d.properties.name === "Oldenburg" || d.properties.name === "Wiesbaden" || d.properties.name === "Mannheim" || d.properties.name === "Nürnberg" || d.properties.name === "Ulm" || d.properties.name === "Osnabrück" || d.properties.name === "Magdeburg" || d.properties.name === "Hannover" || d.properties.name === "Augsburg" || d.properties.name === "Chemnitz" || d.properties.name === "Gera"){
                           return d.geometry.coordinates[0] > 10 ? 6/scalefactor : -6/scalefactor;
                        }else{return d.geometry.coordinates[0] > 10 ? -6/scalefactor : 6/scalefactor; } })
                    .attr("y", function(d) {
                        if(d.properties.name === "Braunschweig" || d.properties.name === "Jena"){
                            return -10/scalefactor;
                        }
                    })
                    .style("font-size", 12/scalefactor+"px");
            }else{
                d3.selectAll(".place-label")
                    .attr("x", function(d) {
                        if(d.properties.name === "Duisburg" || d.properties.name === "Düsseldorf" || d.properties.name === "Oldenburg" || d.properties.name === "Wiesbaden" || d.properties.name === "Mannheim" || d.properties.name === "Nürnberg" || d.properties.name === "Ulm" || d.properties.name === "Osnabrück" || d.properties.name === "Magdeburg" || d.properties.name === "Hannover" || d.properties.name === "Augsburg" || d.properties.name === "Chemnitz" || d.properties.name === "Gera"){
                           return d.geometry.coordinates[0] > 10 ? 6 : -6;
                        }else{return d.geometry.coordinates[0] > 10 ? -6 : 6; } })
                    .attr("y", function(d) {
                        if(d.properties.name === "Braunschweig" || d.properties.name === "Jena"){
                            return -10;
                        }
                    })
                    .style("font-size", 12+"px");
            }
        }

        makeBoundaries(path);
        makeCirclesIni(path);
        makePlaces();
        setLangPlaces();


// ========= legend =========

        /**
        * To change appearance of legend if needed. At the moment the map has always the same legend. Legend consists out of 100 rectangles.
        * @func changeKey
        */
        function changeKey(){

            legendG = legend.append("g");
            legendG
                .attr("class", "legend")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            legendG.append("text")
                .attr("class", "caption")
                .attr("x", 0)
                .attr("y", -7)
                .attr("text-anchor", "start")
                .text(function(d){return german ? "Legende" : "Legend"});

            legendG.selectAll("rect")
                .data(d3.range(min(),max()))
                .enter().append("rect")
                .attr("height", 5)
                .attr("width", 4.5*100/(max()-min()))
                .attr("x", function(d){return (d-min())*4.5*100/(max()-min())});

            legendG.call(d3.axisBottom(d3.scaleLinear().domain([min(),max()]).range([0,450])) //450 = width of all rects = 100*4.5
                .tickSize(13)
                .tickFormat(function(d){return d + "%";})
                .tickValues(d3.range(min(),(max() + max()/10),(max()-min())/10)))
                .select(".domain")
                .remove();
        }

        // initialization
        changeKey();
        changeColorKey();
        onresize();
        d3.selectAll("#representation").raise(); //info about regionality is on the bottom
    }

/**
* triggers when window gets resized
* @func onresize
* @see setHeight
*/
window.onresize = function(event) {
    width = parseInt(d3.select("#map").style("width")); // sets new map width belonging to new window width
    d3.select("#map").attr("height", 1.2*width); // fits hight of map
    d3.select("#key").attr("height", width/10); // fits hight of legend. Legend has same width as map.
    d3.selectAll(".sidebar-offcanvas").attr("height", d3.select("#bild").style("height")); // sets new menu height belonging to new map height
    d3.selectAll("#sidebarRight").attr("height", d3.select("#bild").style("height")); // sets new bar chart panel height belonging to new map height
    d3.selectAll(".pBarchart").attr("width", d3.select("#sidebarRight").style("width")); // sets new bar chart width

    setHeight(); // sets new bar chart heights
}

/**
* sets heights of bar charts
* @func setHeight
* @see onresize
*/
function setHeight(){
    // without mouseover() nor zoom(), from the beginning scalefactors aren't defined
    if(document.getElementById("barchartMean") && !isNaN(parseFloat(document.getElementById("barchartMean").getAttribute("scalefactor")))){ //für den IE
        d3.select("#barchartMeanPosition").attr("height", parseFloat(document.getElementById("barchartMean").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchartMean").attr("height", parseFloat(document.getElementById("barchartMean").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
    if(document.getElementById("barchart0") && !isNaN(parseFloat(document.getElementById("barchart0").getAttribute("scalefactor")))){ //für den IE
        d3.select("#barchart0Position").attr("height", parseFloat(document.getElementById("barchart0").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchart0").attr("height", parseFloat(document.getElementById("barchart0").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
    if(document.getElementById("barchartkv") && !isNaN(parseFloat(document.getElementById("barchartkv").getAttribute("scalefactor")))){ //für den IE
        d3.select("#barchartKVPosition").attr("height", parseFloat(document.getElementById("barchartkv").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchartkv").attr("height", parseFloat(document.getElementById("barchartkv").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
    if(document.getElementById("barchart1") && !isNaN(parseFloat(document.getElementById("barchart1").getAttribute("scalefactor")))){
        d3.select("#barchart1Position").attr("height", parseFloat(document.getElementById("barchart1").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchart1").attr("height", parseFloat(document.getElementById("barchart1").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
    if(document.getElementById("barchart2") && !isNaN(parseFloat(document.getElementById("barchart2").getAttribute("scalefactor")))){
        d3.select("#barchart2Position").attr("height", parseFloat(document.getElementById("barchart2").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchart2").attr("height", parseFloat(document.getElementById("barchart2").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
    if(document.getElementById("barchart1BL") && !isNaN(parseFloat(document.getElementById("barchart1BL").getAttribute("scalefactor")))){
        d3.select("#barchart1BLPosition").attr("height", parseFloat(document.getElementById("barchart1BL").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchart1BL").attr("height", parseFloat(document.getElementById("barchart1BL").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
    if(document.getElementById("barchart2BL") && !isNaN(parseFloat(document.getElementById("barchart2BL").getAttribute("scalefactor")))){
        d3.select("#barchart2BLPosition").attr("height", parseFloat(document.getElementById("barchart2BL").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchart2BL").attr("height", parseFloat(document.getElementById("barchart2BL").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
    if(document.getElementById("barchart1KV") && !isNaN(parseFloat(document.getElementById("barchart1KV").getAttribute("scalefactor")))){
        d3.select("#barchart1KVPosition").attr("height", parseFloat(document.getElementById("barchart1KV").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchart1KV").attr("height", parseFloat(document.getElementById("barchart1KV").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
    if(document.getElementById("barchart2KV") && !isNaN(parseFloat(document.getElementById("barchart2KV").getAttribute("scalefactor")))){
        d3.select("#barchart2KVPosition").attr("height", parseFloat(document.getElementById("barchart2KV").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchart2KV").attr("height", parseFloat(document.getElementById("barchart2KV").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
    if(document.getElementById("barchart3") && !isNaN(parseFloat(document.getElementById("barchart3").getAttribute("scalefactor")))){
        d3.select("#barchart3Position").attr("height", parseFloat(document.getElementById("barchart3").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchart3").attr("height", parseFloat(document.getElementById("barchart3").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
    if(document.getElementById("barchart4") && !isNaN(parseFloat(document.getElementById("barchart4").getAttribute("scalefactor")))){
        d3.select("#barchart4Position").attr("height", parseFloat(document.getElementById("barchart4").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
        d3.select("#barchart4").attr("height", parseFloat(document.getElementById("barchart4").getAttribute("scalefactor"))*d3.select("#sidebarRight").style("width").split("px")[0]);
    }
}

/**
* initialization bar charts
* @func iniBarchart
* @param {string} barchartposition id of bar chart div
* @param {string} idname id of bar chart SVG
*/
function iniBarchart(barchartposition, idname){

    svgBars = d3.select(barchartposition).append("g").attr("class", idname)
        .append("svg")
        .attr("class", "barchart")
        .attr("id", idname);

    svgBars.append("g")
        .attr("class", "yAxisBl");

    d3.selectAll("#"+idname).style("display", "none");
}

/**
* orders counties for ranking
* @func lkData
* @returns {array} lkData
* @see cutbarchart
* @see orderLKs
*/
var lkData = function(){
    var lkData = [];
    var lkDataWorst = [];

        for (var i = 0; i < ordered.length; i++){
            if(zoomedKv || (!zoomedKv && blPressed == 2)){ // hier noch wenn blPressed 2
                if (ordered[i].state == aships[1]){
                    if(ordered[i].ordered.length > cutbarchart*2){
                        lkData = ordered[i].ordered.slice(0,cutbarchart);
                        lkDataWorst = ordered[i].ordered.slice((ordered[i].ordered.length - cutbarchart),ordered[i].ordered.length);
                        for (var j = 0; j < lkDataWorst.length; j++) {
                            lkData.push(lkDataWorst[j]);
                        }
                    }else{
                        lkData = ordered[i].ordered;
                    }
                }
            }else if (ordered[i].state == classes[1]){
                if(ordered[i].ordered.length > cutbarchart*2){
                    lkData = ordered[i].ordered.slice(0,cutbarchart);
                    lkDataWorst = ordered[i].ordered.slice((ordered[i].ordered.length - cutbarchart),ordered[i].ordered.length);
                    for (var j = 0; j < lkDataWorst.length; j++) {
                        lkData.push(lkDataWorst[j]);
                    }
                }else{
                    lkData = ordered[i].ordered;
                }
            }
        }
    return lkData;
}

/**
* number of counties in ranking. If state has more than 10 counties, numberLK returns 10 (if cutbarchart = 5). If state has less, it returns the actual number.
* @func numberLK
* @returns {integer} 10 or number of counties in state
* @see cutbarchart
* @see orderLKs
*/
var numberLK = function(){
    var numberLK;
    for (var i = 0; i < ordered.length; i++){
        if (ordered[i].state == classes[1]){
            if(ordered[i].ordered.length > 2*cutbarchart){
                numberLK = 2*cutbarchart;
            }else{
                numberLK = ordered[i].ordered.length;
            }
        }
    }
    return numberLK;
}

/**
* creates array for birth cohort bar chart (county representation) with one object for each age-group with vax value for selected vax dose
* @func firstTimeData
* @param {object} d topoJSON object of county
* @param {string} selectedCategories e.g. "First dose"
* @returns {array} jahrgangData
*/
function firstTimeData(d,selectedCategories){
    /**
    * prototype to store age-group and value of age-group for specific county
    * @func JahrgangData
    * @param {string} ag age in month, e.g. "15"
    * @param {integer} agValue percentage of vaccination
    */
    function JahrgangData(ag,agValue){
        this.Altersgruppe = ag;
        this.value = agValue;
    }
    var c = 0;
    var jahrgangData = [];

    for (var i = 0; i < secondTime.length; i++) {
        var agValue = pathToValue(datasetobj, selectedFirstTime, secondTime[i])[d.id][roundValue(datasetname, secondTime[i], selectedCategories)];
        if(agValue == undefined){
            c++
        }else{
            jahrgangData[i-c] = new JahrgangData(secondTime[i],agValue);
        }
    };
    return jahrgangData;
}

/**
* creates array for birth cohort bar chart (state representation) with one object for each age-group with vax value for selected vax dose
* @func firstTimeDataBL
* @param {string} d name of state
* @param {string} selectedCategories e.g. "First dose"
* @returns {array} jahrgangDataBL
*/
function firstTimeDataBL(d,selectedCategories){
    /**
    * prototype to store age-group and value of age-group for specific state
    * @func JahrgangDataBL
    * @param {string} ag age in month, e.g. "15"
    * @param {integer} agValue percentage of vaccination
    */
    function JahrgangDataBL(ag,agValue){
        this.Altersgruppe = ag;
        this.value = agValue;
    }
    var c = 0;
    var jahrgangDataBL = [];

    for (var i = 0; i < secondTime.length; i++) {
        var agValueBL = datasetobj[selectedFirstTime][secondTime[i]].states[d][roundValue(datasetname, secondTime[i], selectedCategories)];
        if(agValueBL == undefined){
            c++
        }else{
            jahrgangDataBL[i-c] = new JahrgangDataBL(secondTime[i],agValueBL);
        }
    };
     return jahrgangDataBL;
}

/**
* creates array for birth cohort bar chart (kv representation) with one object for each age-group with vax value for selected vax dose
* @func firstTimeDataKV
* @param {string} d name of kv
* @param {string} selectedCategories e.g. "First dose"
* @returns {array} jahrgangDataKV
*/
function firstTimeDataKV(d,selectedCategories){
    /**
    * prototype to store age-group and value of age-group for specific kv
    * @func JahrgangDataKV
    * @param {string} ag age in month, e.g. "15"
    * @param {integer} agValue percentage of vaccination
    */
    function JahrgangDataKV(ag,agValue){
        this.Altersgruppe = ag;
        this.value = agValue;
    }
    var c = 0;
    var jahrgangDataKV = [];

    for (var i = 0; i < secondTime.length; i++) {
        var agValueKV = datasetobj[selectedFirstTime][secondTime[i]].kv[d][roundValue(datasetname, secondTime[i], selectedCategories)]; // hier fehler iphone, gibt undefined
        if(agValueKV == undefined){
            c++
        }else{
            jahrgangDataKV[i-c] = new JahrgangDataKV(secondTime[i],agValueKV);
        }
    };
     return jahrgangDataKV;
}

/**
* creates array for age-group bar chart (state representation) with one object for each birth cohort with vax value for selected vax dose
* @func secondTimeDataBL
* @param {string} d name of state
* @param {string} selectedCategories e.g. "First dose"
* @returns {array} altersgruppeDataBL
*/
function secondTimeDataBL(d,selectedCategories){
    /**
    * prototype to store birth cohort and value of birth cohort for specific state
    * @func AltersgruppeDataBL
    * @param {string} ag age in month, e.g. "15"
    * @param {integer} agValue percentage of vaccination
    */
    function AltersgruppeDataBL(jg,jgValue){
            this.Jahrgang = jg;
            this.value = jgValue;
    }
    var c = 0;
    var altersgruppeDataBL = [];

    for (var i = 0; i < firstTime.length; i++) {
        var jgValueBL = datasetobj[firstTime[i]][selectedSecondTime].states[d][rv];
        if(jgValueBL == undefined){
            c++
        }else{
            altersgruppeDataBL[i-c] = new AltersgruppeDataBL(firstTime[i],jgValueBL);
        }
    };
    return altersgruppeDataBL;
}
/**
* creates array for age-group bar chart (state representation) with one object for each birth cohort with vax value for selected vax dose
* @func secondTimeDataBL
* @param {string} d name of state
* @param {string} selectedCategories e.g. "First dose"
* @returns {array} altersgruppeDataBL
*/
function secondTimeDataKV(d,selectedCategories){
    /**
    * prototype to store birth cohort and value of birth cohort for aship
    * @func AltersgruppeDataKV
    * @param {string} ag age in month, e.g. "15"
    * @param {integer} agValue percentage of vaccination
    */
    function AltersgruppeDataKV(jg,jgValue){
            this.Jahrgang = jg;
            this.value = jgValue;
    }
    var c = 0;
    var altersgruppeDataKV = [];

    for (var i = 0; i < firstTime.length; i++) {
        var jgValueKV = datasetobj[firstTime[i]][selectedSecondTime].kv[d][rv];
        if(jgValueKV == undefined){
            c++
        }else{
            altersgruppeDataKV[i-c] = new AltersgruppeDataKV(firstTime[i],jgValueKV);
        }
    };
    return altersgruppeDataKV;
}
/**
* creates array for age-group bar chart (county representation) with one object for each birth cohort with vax value for selected vax dose
* @func secondTimeData
* @param {object} d topoJSON object of county
* @param {string} selectedCategories e.g. "First dose"
* @returns {array} altersgruppeData
*/
function secondTimeData(d,selectedCategories){
    /**
    * prototype to store birth cohort and value of birth cohort for specific county
    * @func AltersgruppeData
    * @param {string} ag age in month, e.g. "15"
    * @param {integer} agValue percentage of vaccination
    */
    function AltersgruppeData(jg,jgValue){
            this.Jahrgang = jg;
            this.value = jgValue;
    }
    var c = 0;
    var altersgruppeData = [];

    for (var i = 0; i < firstTime.length; i++) {
        var jgValue = pathToValue(datasetobj, firstTime[i], selectedSecondTime)[d.id][rv];
        if(jgValue == undefined){
            c++
        }else{
            altersgruppeData[i-c] = new AltersgruppeData(firstTime[i],jgValue);
        }
    };
    return altersgruppeData;
}

/**
* builds bar charts
* @func makeBarchart
* @param {object} d {} or TopoJSON object of county
* @param {object} subunitsFeatures {} or featuresCB
* @param {string} barchartposition id of bar chart div
* @param {string} idname id of bar chart SVG
* @param {array} inputData1 data which shall be presented
* @param {integer} inputData2 length of inputData1
* @param {string} vari1 property name of inputData1
* @param {string} vari2 property name of inputData1 which gives vax value
* @param {integer} vari3 1,2,3,4 for name truncations etc.
* @see lokal
* @see firstTimeData
* @see firstTimeDataBL
* @see secondTimeData
* @see secondTimeDataBL
* @see rv
* @see orderLKs
* @see orderBLs
* @see meanDataBuilder
* @see lkData
* @see numberLK
* @see cutbarchart
*/
function makeBarchart(d, subunitsFeatures, barchartposition, idname, inputData1, inputData2, vari1, vari2, vari3){

    var languageMonth;

    languageMonth = (datasetname == "dataMeasles") ? (german ? " Monate" : " months") : (german ? " Wochen" : " weeks")

    var selectSVG = d3.selectAll("."+idname).select("svg");

    selectSVG
        .attr("viewBox", "-10 0 350 " + (inputData2*15))
        .attr("scalefactor", (inputData2*13)/350);

    var x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, widthBars]);

    var y = d3.scaleBand()
        .domain(inputData1.map(function(d){return d[vari1]; }))
        .rangeRound([0, inputData2*15])
        .paddingInner(.15);

    var yAxisBl = d3.axisLeft(y).tickFormat(function (d) { return ''; }).tickSize(0);

    if(d.properties !== undefined){
        var selectedLK = makePrefix(d);
    }else{
        var selectedLK = "";
    }

    // data join + update
    var rects = selectSVG.selectAll(".blTip").data(inputData1);

    rects.select("rect")
        .attr("class", function(d){
            return (d[vari1] == selectedFirstTime || d[vari1] == selectedSecondTime || d[vari1] == classes[1] || d[vari1] == selectedLK) ? ("rectElements_selected"+barchartposition) : "rectElements";
          })
        .attr("x", function(d) { return x(0); })
        .attr("y", function(d) { return y(d[vari1]); })
        .attr("height", y.bandwidth())
        .transition().duration(1000)
        .style("fill", function(d){ return color(d[vari2]); })
        .attr("width", function(d) { return x(d[vari2]); });

    // exit
    rects.exit().remove();

    // enter
    var newRects = rects
      .enter()
      .append("g")
        .attr("class", "blTip");

    newRects.append("rect")
        .attr("class", function(d){
            return (d[vari1] == selectedFirstTime || d[vari1] == selectedSecondTime || d[vari1] == classes[1] || d[vari1] == selectedLK) ? ("rectElements_selected"+barchartposition) : "rectElements";
          })
        .attr("x", function(d) { return x(0); })
        .attr("y", function(d) { return y(d[vari1]); })
        .attr("height", y.bandwidth())
        .style("fill", function(d){ return color(70); })
        .attr("width", function(d) { return x(70); })
        .transition().duration(1000)
        .style("fill", function(d){return color(d[vari2]); })
        .attr("width", function(d) { return x(d[vari2]); });

    newRects.append("text").attr("id", "tipbarchart");
    newRects.append("text").attr("id", "tipbarchart2");

    // text for bars

    // text on bars
    rects.select("text#tipbarchart")
        .attr("y", function(d) { return y(d[vari1]) + 8; })
        .attr("text-anchor", "end")
        .attr("id", "tipbarchart")
        .text(function(d){ // names
            if (d[vari2] !== undefined){
                if(getTextWidth(d[vari1] + 4, 10) > Math.abs(x(d[vari2]))){ // if text is longer than bar
                    if(vari3 == 1 || vari3 == 2 || vari3 == 4){
                        return "";
                    }
                    else if(vari3 == 3){ // KFZ (license tag) instead name for county is used
                        for(var j = 0; j < subunitsFeatures.length; j++){
                            if(d.kkz === subunitsFeatures[j].id){
                                if(getTextWidth(subunitsFeatures[j].properties.kfz, 10) > Math.abs(x(d[vari2]))){ // if KFZ is longer than bars, it shifts to the right
                                    return "";
                                }else{
                                    return subunitsFeatures[j].properties.kfz;
                                }
                            }
                        }
                    }
                }else if(vari3 == 1){
                    if(getTextWidth(d[vari1] + languageMonth + 4, 10) > Math.abs(x(d[vari2]))){
                            return "";
                        }else{
                            return d[vari1] + languageMonth;}
                }else{
                    if(!german && (inputData1 == orderedBl || inputData1 == orderedKv) && d.stateEN !== null){
                        return d.stateEN;
                    }else if(!german && inputData1 == meanData){
                        return "Germany";
                    }else{
                        return d[vari1];
                    }
                }
            }
        })
        .transition().duration(1000)
        .attr("x", function(d) { return x(d[vari2]);});

    //text on right side of bars
    rects.select("text#tipbarchart2")
        .attr("y", function(d) { return y(d[vari1]) + 8; })
        .attr("text-anchor", "start")
        .attr("id", "tipbarchart2")
        .text(function(d){ // values
            if(vari3 == 1){
                if(getTextWidth(d[vari1] + languageMonth + 4, 10) > Math.abs(x(d[vari2]))){
                    return d[vari1] + languageMonth + ", " + parseFloat(d[vari2]).toFixed(1) + " %";
                }else{
                    return parseFloat(d[vari2]).toFixed(1) + " %";
                }
            }else if(getTextWidth(d[vari1] + 4, 10) > Math.abs(x(d[vari2]))){
                if(vari3 == 3){
                    for(var j = 0; j < subunitsFeatures.length; j++){
                        if(d.kkz === subunitsFeatures[j].id){
                            if(getTextWidth(subunitsFeatures[j].properties.kfz, 10) > Math.abs(x(d[vari2]))){ // if KFZ is longer than bars, it shifts to the right
                                return subunitsFeatures[j].properties.kfz + ", " + parseFloat(d[vari2]).toFixed(1) + " %";
                            }else{
                                return parseFloat(d[vari2]).toFixed(1) + " %";
                            }
                        }
                    }
                }
                else if(vari3 == 2 || vari3 == 4){
                    if(!german && (inputData1 == orderedBl || inputData1 == orderedKv) && d.stateEN !== null){
                        return d.stateEN + ", " + parseFloat(d[vari2]).toFixed(1) + " %";

                    }else{
                        return d[vari1] + ", " + parseFloat(d[vari2]).toFixed(1) + " %";
                    }
                }
            }else{
                return parseFloat(d[vari2]).toFixed(1) + " %";
            }
        })
        .transition().duration(1000)
        .attr("x", function(d) { return x(d[vari2]) + 4; });

    newRects.select("text#tipbarchart")
        .attr("y", function(d) { return y(d[vari1]) + 8; })
        .attr("text-anchor", "end")
        .attr("id", "tipbarchart")
        .text(function(d){
            if (d[vari2] !== undefined){
                if(getTextWidth(d[vari1] + 4, 10) > Math.abs(x(d[vari2]))){
                    if(vari3 == 1 || vari3 == 2 || vari3 == 4){
                        return "";
                    }
                    else if(vari3 == 3){
                        for(var j = 0; j < subunitsFeatures.length; j++){
                            if(d.kkz === subunitsFeatures[j].id){
                                if(getTextWidth(subunitsFeatures[j].properties.kfz, 10) > Math.abs(x(d[vari2]))){
                                    return "";
                                }else{
                                    return subunitsFeatures[j].properties.kfz;
                                }
                            }
                        }
                    }
                }else if(vari3 == 1){
                    if(getTextWidth(d[vari1] + languageMonth + 4, 10) > Math.abs(x(d[vari2]))){
                            return "";
                        }else{
                            return d[vari1] + languageMonth;}
                }else{
                    if(!german && (inputData1 == orderedBl || inputData1 == orderedKv) && d.stateEN !== null){
                        return d.stateEN;
                    }else if(!german && inputData1 == meanData){
                        return "Germany";
                    }else{
                        return d[vari1];
                    }
                }
            }
        })
        .attr("x", function(d) { return x(70);})
        .transition().duration(1000)
        .attr("x", function(d) { return x(d[vari2]);}) ;

    newRects.select("text#tipbarchart2")
        .attr("y", function(d) { return y(d[vari1]) + 8; })
        .attr("text-anchor", "start")
        .attr("id", "tipbarchart2")
        .text(function(d){
            if(vari3 == 1){
                if(getTextWidth(d[vari1] + languageMonth + 4, 10) > Math.abs(x(d[vari2]))){
                    return d[vari1] + languageMonth + ", " + parseFloat(d[vari2]).toFixed(1) + " %";
                }else{
                    return parseFloat(d[vari2]).toFixed(1) + " %";
                }
            }else if(getTextWidth(d[vari1] + 4, 10) > Math.abs(x(d[vari2]))){
                if(vari3 == 3){
                    for(var j = 0; j < subunitsFeatures.length; j++){
                        if(d.kkz === subunitsFeatures[j].id){
                            if(getTextWidth(subunitsFeatures[j].properties.kfz, 10) > Math.abs(x(d[vari2]))){
                                return subunitsFeatures[j].properties.kfz + ", " + parseFloat(d[vari2]).toFixed(1) + " %";
                            }else{
                                return parseFloat(d[vari2]).toFixed(1) + " %";
                            }
                        }
                    }
                }
                else if(vari3 == 2 || vari3 == 4){
                    if(!german && (inputData1 == orderedBl || inputData1 == orderedKv) && d.stateEN !== null){
                        return d.stateEN + ", " + parseFloat(d[vari2]).toFixed(1) + " %";

                    }else{
                        return d[vari1] + ", " + parseFloat(d[vari2]).toFixed(1) + " %";
                    }
                }
            }else{
                return parseFloat(d[vari2]).toFixed(1) + " %";
            }
        })
        .attr("x", function(d) { return x(70) + 4;})
        .transition().duration(1000)
        .attr("x", function(d) { return x(d[vari2]) + 4; }) ;

    /**
    * makes lines in a SVG, for indicators on top und bottom of the bar charts to see nationwide average
    * @func positionPathLine
    * @param {array} path start and end point
    * @see indicator
    */
    function positionPathLine(path) {
        path.attr("d", function(d) { return "M" + d.join("L"); });
    }

    /**
    * this makes little tags on the top and bottom of the bar charts to indicate the nationwide average, but it does only work fine with FireFox. Chrome etc. have problems with transforming
    * @class indicator
    * @todo realize indicator tags for all browsers
    */
    // if(idname !== "barchartMean"){

    //     var upperMeanPfeil = selectSVG.selectAll(".upperMeanIndicator").data(meanData)
    //         .attr("transform", function(d){ return "translate(" + x(meanData[0].ordered) + ",0)"})
    //         .attr("id", "upperMeanIndicator").datum([[0,-7],[0,-1]]);

    //     upperMeanPfeil.select("path")
    //         .call(positionPathLine)
    //         .style("stroke", "black")
    //         .style("stroke-width", "1px");

    //     var upperMeanPfeil2 = selectSVG.selectAll(".upperMeanIndicator2").data(meanData)
    //         .attr("transform", function(d){ return "translate(" + x(meanData[0].ordered) + ",0)"})
    //         .attr("id", "upperMeanIndicator2").datum([[-3,-7],[3,-7]]);

    //     upperMeanPfeil2.select("path")
    //         .call(positionPathLine)
    //         .style("stroke", "black")
    //         .style("stroke-width", "1px");

    //     var lowerMeanPfeil = selectSVG.selectAll(".lowerMeanIndicator").data(meanData)
    //         .attr("transform", function(d){ return "translate(" + x(meanData[0].ordered) + "," + inputData2*15 +")"})
    //         .attr("id", "lowerMeanIndicator").datum([[0,5],[0,-1]]);

    //     lowerMeanPfeil.select("path")
    //         .call(positionPathLine)
    //         .style("stroke", "black")
    //         .style("stroke-width", "1px");

    //     var lowerMeanPfeil2 = selectSVG.selectAll(".lowerMeanIndicator2").data(meanData)
    //         .attr("transform", function(d){ return "translate(" + x(meanData[0].ordered) + "," + inputData2*15 +")"})
    //         .attr("id", "lowerMeanIndicator2").datum([[-3,5],[3,5]]);

    //     lowerMeanPfeil2.select("path")
    //         .call(positionPathLine)
    //         .style("stroke", "black")
    //         .style("stroke-width", "1px");
    // }

    /**
    * makes paths in a SVG, for little triangles on the left side of the bars
    * @func positionPath
    * @param {array} path points of triangles
    */
    function positionPath(path) {
            path.attr("d", function(d) { return "M" + d.join("L") + "Z"; });
        }

    // little triangles shown on the left side of the bars to indicate selected state/birth cohort/age-group etc.
    var dreieck = selectSVG.selectAll(".polygon").data(inputData1)
        .attr("transform", function(d){ return "translate(0," + y(d[vari1]) + ")"})
        .attr("id", function(d){
            return (barchartposition == "#barchartKVPosition") ? "kvpoly"+d[vari1] : "poly"+d[vari1];
        })
        .attr("class", function(d){
            return (d[vari1] == selectedFirstTime || d[vari1] == selectedSecondTime || d[vari1] == classes[1] || d[vari1] == aships[1] || d[vari1] == selectedLK) ? "polySelected polygon" : "polygon";
          })
        .datum([[-6,0],[-6,14],[-1,7]]);
    dreieck.select("path")
        .call(positionPath)
        .style("fill", function(d){if(this.parentNode.className.baseVal.split(" ")[0] !== "polySelected"){return "none"}else{return "black"}});
    dreieck.exit().remove();
    dreieck.enter()
        .append("g")
        .attr("id", function(d){
            return (barchartposition == "#barchartKVPosition") ? "kvpoly"+d[vari1] : "poly"+d[vari1];
        })
        .attr("transform", function(d){ return "translate(0," + y(d[vari1]) + ")"})
        .attr("class", function(d){
            return (d[vari1] == selectedFirstTime || d[vari1] == selectedSecondTime || d[vari1] == classes[1] || d[vari1] == aships[1] || d[vari1] == selectedLK) ? "polySelected polygon" : "polygon";
          })
        .datum([[-6,0],[-6,14],[-1,7]])
        .append("path")
        .call(positionPath)
        .style("fill", function(d){if(this.parentNode.className.baseVal.split(" ")[0] !== "polySelected"){return "none"}else{return "black"}});

    selectSVG.selectAll(".yAxisBl")
        .call(yAxisBl);

    // movers y axis at the bottom in the DOM, so it has no overlap through bars
    d3.selectAll(".yAxisBl").raise();

    setHeight();
}

/**
* returns text length
* @func getTextWidth
* @param {string} text
* @param {integer} fontSize
* @param {string} fontFace
*/
function getTextWidth(text, fontSize, fontFace) {
    var a = document.createElement('canvas');
    var b = a.getContext('2d');
    b.font = fontSize + 'px ' + fontFace;
    return b.measureText(text).width;
}

/**
* converts e.g. "Roth" to "LK Roth"
* @func makePrefix
* @param {object} d TopoJSON object of county
* @returns prefixName
*/
function makePrefix(d){
    if(d.properties.districtType == "Landkreis" || d.properties.districtType == "Kreis"){
        prefixName = "LK " + d.properties.name;
    }else if(d.properties.districtType == "Stadtkreis" || d.properties.districtType == "Kreisfreie Stadt"){
        prefixName = "SK " + d.properties.name;
    }else{
        prefixName = "Bezirk " + d.properties.name;
    }
    return prefixName;
}

/**
* sets language of city names
* @func setLangPlaces
* @see makePlaces
*/
function setLangPlaces(){
    if(german){
        d3.selectAll(".place-label")
            .data(places.features)
            .text(function(d) { return d.properties.name; });
    }else{
        d3.selectAll(".place-label")
            .data(places.features)
            .text(function(d) { return d.properties.nameEN == null ? d.properties.name : d.properties.nameEN; });
    }
}

function setLangRepresentation(){
    if(german){
        if(blPressed == 0){
            document.getElementById("representation").innerHTML = "Regionalität: Landkreise"
        }else if(blPressed == 1){
            document.getElementById("representation").innerHTML = "Regionalität: Bundesländer"
        }else if(blPressed == 2){
            document.getElementById("representation").innerHTML = "Regionalität: Kassenärztliche Vereinigungen"
        }
    }else{
        if(blPressed == 0){
            document.getElementById("representation").innerHTML = "Regionality: Counties"
        }else if(blPressed == 1){
            document.getElementById("representation").innerHTML = "Regionality: States"
        }else if(blPressed == 2){
            document.getElementById("representation").innerHTML = "Regionality: ASHIPs"
        }
    }
}

// =====buttons===== , written in jQuery

$(document).ready(function () {

  // hides/shows menu
  $('[data-toggle="offcanvas"]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });

  // infobutton, hides/shows info text
  $('.infoButton').click(function () {
    if($('.infoButton').hasClass("collapsed")){
      if(german){
        $('.infoButton').text("Erklärung ausblenden");
      }else{
        $('.infoButton').text("Hide information");
      }
    }else{
      if(german){
        $('.infoButton').text("Erklärung einblenden");
      }else{
        $('.infoButton').text("Show information");
      }
    }
  });

  // initialization
  // in index.html there are divs for English and German
  if(german){
    $('.english').css("display", "none");
    $('.german').css("display", "block");
    if(datasetname == "dataMeasles"){
      $('.german.rotavirus').css("display", "none");
      $('.german.measles').css("display", "block");
    }else if(datasetname == "rotavirus"){
      $('.german.rotavirus').css("display", "block");
      $('.german.measles').css("display", "none");
      }
    $('.btn.german').css("display", "inline");
  }else{
    $('.german').css("display", "none");
    $('.english').css("display", "block");
    if(datasetname == "dataMeasles"){
      $('.english.rotavirus').css("display", "none");
      $('.english.measles').css("display", "block");
    }else if(datasetname == "rotavirus"){
      $('.english.rotavirus').css("display", "block");
      $('.english.measles').css("display", "none");
      }
    $('.btn.english').css("display", "inline");
  }

  if(!isMobile.any()){
        $('.downloadButton').tooltip();
        $('.switchBlLk').tooltip();
        $('.switchStadt').tooltip();
    }


  // English button
  $('.englishButton').click(function () {
    german = false;
      $('.german').css("display", "none");
      $('.english').css("display", "block");
      if(datasetname == "dataMeasles"){
        $('.english.rotavirus').css("display", "none");
        $('.english.measles').css("display", "block");
      }else if(datasetname == "rotavirus"){
        $('.english.rotavirus').css("display", "block");
        $('.english.measles').css("display", "none");
        }
      $('.btn.english').css("display", "inline");
    setLangRepresentation();

    setLangPlaces();
    makeBarchart({}, {}, "#barchartMeanPosition","barchartMean",meanData, meanData.length, "state", "ordered", 4);
    makeBarchart({}, {}, "#barchart0Position","barchart0",orderedBl, orderedBl.length, "state", "ordered", 4);
    makeBarchart({}, {}, "#barchartKVPosition","barchartkv",orderedKv, orderedKv.length, "state", "ordered", 4);
    d3.selectAll(".polySelected").select("path").style("fill", "none");

    d3.selectAll("#firstTime tr td.tableheader").text("Birth cohort");
    d3.selectAll("#secondTime tr td.tableheader").text("Age-group");
    d3.selectAll("#categories tr td.tableheader").text("Category");
    d3.selectAll(".caption").text("Legend");
    d3.select("#titelMean").html("Nationwide average");
    d3.select("#titelBL").html("Ranking of states");
    d3.select("#titelKV").html("Ranking of ASHIPs");

    // changes language of units in menu for secondTime
    d3.selectAll("#secondTime.table tr.boxRow td").nodes().forEach(function(d){d.innerHTML = d.innerHTML.split(" ")[0] + ((datasetname == "dataMeasles") ? (german ? " Monate" : " months") : (german ? " Wochen" : " weeks") )});

    // changes language of elements in category
    d3.selectAll("#categories.table tr.boxRow td").nodes().forEach(function(d,i){
        var catArray = ["category1", "category2"];
        d.innerHTML = german? categoriesObj[datasetname].german[catArray[i]] : categoriesObj[datasetname].english[catArray[i]];
    });

    // changes language of info button
    if($('.infoButton').hasClass("collapsed")){
      $('.infoButton').text("Show information");
    }else{
      $('.infoButton').text("Hide information");
    }

  });

  // German button
  $('.germanButton').click(function () {
    german = true;
      $('.english').css("display", "none");
      $('.german').css("display", "block");
      if(datasetname == "dataMeasles"){
        $('.german.rotavirus').css("display", "none");
        $('.german.measles').css("display", "block");
      }else if(datasetname == "rotavirus"){
        $('.german.rotavirus').css("display", "block");
        $('.german.measles').css("display", "none");
        }
      $('.btn.german').css("display", "inline");
    setLangRepresentation();
    setLangPlaces();
    makeBarchart({}, {}, "#barchartMeanPosition","barchartMean",meanData, meanData.length, "state", "ordered", 4);
    makeBarchart({}, {}, "#barchart0Position","barchart0",orderedBl, orderedBl.length, "state", "ordered", 4);
    makeBarchart({}, {}, "#barchartKVPosition","barchartkv",orderedKv, orderedKv.length, "state", "ordered", 4);
    d3.selectAll(".polySelected").select("path").style("fill", "none");

    d3.selectAll("#firstTime tr td.tableheader").text("Jahrgang");
    d3.selectAll("#secondTime tr td.tableheader").text("Altersgruppe");
    d3.selectAll("#categories tr td.tableheader").text("Kategorie");
    d3.selectAll(".caption").text("Legende");
    d3.select("#titelMean").html("Bundesweites Mittel");
    d3.select("#titelBL").html("Ranking Bundesländer");
    d3.select("#titelKV").html("Ranking Kassenärztliche Vereinigungen");

    // changes language of units in menu for secondTime
    d3.selectAll("#secondTime.table tr.boxRow td").nodes().forEach(function(d){d.innerHTML = d.innerHTML.split(" ")[0] + ((datasetname == "dataMeasles") ? (german ? " Monate" : " months") : (german ? " Wochen" : " weeks") )});

    // changes language of elements in category
    d3.selectAll("#categories.table tr.boxRow td").nodes().forEach(function(d,i){
        var catArray = ["category1", "category2"];
        d.innerHTML = german? categoriesObj[datasetname].german[catArray[i]] : categoriesObj[datasetname].english[catArray[i]];
    });

    // changes language of info button
    if($('.infoButton').hasClass("collapsed")){
      $('.infoButton').text("Erklärung einblenden");
    }else{
      $('.infoButton').text("Erklärung ausblenden");
    }
  });

  // for mobile devices, so the buttons don't stay pushed
  $(".btn").mouseup(function(){
    $(this).blur();
  });

    /**
    * download function creates csv files
    * @func exportToCSV
    * @param {string} filename csv gets saved as filename.csv
    */
    function exportToCSV(filename) {
      var colDelim = ',';
      var rowDelim = '\r\n';

      if(german){
        var csv = '"'+'Landkreis'+ '"' + colDelim + '"' +'Impfquote'+ '"' + rowDelim;
        var csvBL = '"'+'Bundesland'+ '"' + colDelim + '"' +'Impfquote'+ '"' + rowDelim;
        var csvKV = '"'+'Krankenkassenverband'+ '"' + colDelim + '"' +'Impfquote'+ '"' + rowDelim;
      }else{
        var csv = '"'+'County'+ '"' + colDelim + '"' +'Vaccination rate'+ '"' + rowDelim;
        var csvBL = '"'+'State'+ '"' + colDelim + '"' +'Vaccination rate'+ '"' + rowDelim;
        var csvKV = '"'+'ASHIP'+ '"' + colDelim + '"' +'Vaccination rate'+ '"' + rowDelim;
      }

      //csv for lk, bl, kv
      if(!zoomed){ // zoomed out
        if(blPressed == 0){
            for (args in ptv) {
                csv += '"'+ptv[args].lk+'"'; // county column
                csv += colDelim;
                if(ptv[args][rv] == undefined){
                  csv += "";
                }else{
                  csv += ptv[args][rv]; // vax value column
                }
                csv += rowDelim;
            };
        }else if(blPressed == 1){
            for (args in datasetobj[selectedFirstTime][selectedSecondTime].states) {
                (german || statesEnObj[args] == null) ? (csvBL += '"'+args+'"') : (csvBL += '"'+statesEnObj[args]+'"');
                csvBL += colDelim;
                if(datasetobj[selectedFirstTime][selectedSecondTime].states[args][rv] == undefined){
                    csvBL += "";
                }else{
                    csvBL += datasetobj[selectedFirstTime][selectedSecondTime].states[args][rv];
                }
                csvBL += rowDelim;
            };
        }else if(blPressed == 2){
            for (args in datasetobj[selectedFirstTime][selectedSecondTime].kv) {
                (german || statesEnObj[args] == null) ? (csvKV += '"'+args+'"') : (csvKV += '"'+statesEnObj[args]+'"');
                csvKV += colDelim;
                if(datasetobj[selectedFirstTime][selectedSecondTime].kv[args][rv] == undefined){
                    csvKV += "";
                }else{
                    csvKV += datasetobj[selectedFirstTime][selectedSecondTime].kv[args][rv];
                }
                csvKV += rowDelim;
            };
        }
      }else{ // zoomed in
        if(blPressed == 0){ //this has kv inside, because map switches into blPressed = 0 during zoom in. it gives list of lk in kv
            if(zoomedStateKV == "Nordrhein"){
                for (var i = 0; i < nordrheinList.length; i++) {
                    csv += '"'+makePrefix(nordrheinList[i])+'"';
                    csv += colDelim;
                    if(ptv[nordrheinList[i].id][rv] == undefined){
                      csv += "";
                    }else{
                      csv += ptv[nordrheinList[i].id][rv];
                    }
                    csv += rowDelim;
                };
            }else if(zoomedStateKV == "Westfalen-Lippe"){
                for (var i = 0; i < westfalenLippeList.length; i++) {
                    csv += '"'+makePrefix(westfalenLippeList[i])+'"';
                    csv += colDelim;
                    if(ptv[westfalenLippeList[i].id][rv] == undefined){
                      csv += "";
                    }else{
                      csv += ptv[westfalenLippeList[i].id][rv];
                    }
                    csv += rowDelim;
                };
            }else{
                for (args in ptv) {
                    if(ptv[args].bl == zoomedState){
                        csv += '"'+ptv[args].lk+'"';
                        csv += colDelim;
                        if(ptv[args][rv] == undefined){
                          csv += "";
                        }else{
                          csv += ptv[args][rv];
                        }
                        csv += rowDelim;
                    };
                }
            }
        }else if(blPressed == 1 ){
            for (args in datasetobj[selectedFirstTime][selectedSecondTime].states) {
                if(args == zoomedState){
                    (german || statesEnObj[args] == null) ? (csvBL += '"'+args+'"') : (csvBL += '"'+statesEnObj[args]+'"');
                    csvBL += colDelim;
                    if(datasetobj[selectedFirstTime][selectedSecondTime].states[args][rv] == undefined){
                      csvBL += "";
                    }else{
                      csvBL += datasetobj[selectedFirstTime][selectedSecondTime].states[args][rv];
                    }
                    csvBL += rowDelim;
                };
            }

        }else if(blPressed == 2){ //zoom in and switched to kv representation. it gives total kv not the lks
            if(zoomedStateKV == "Nordrhein"){
                german ? (csvKV += '"'+"Nordrhein"+'"') : (csvKV += '"'+"North Rhine"+'"');
                csvKV += colDelim;
                if(datasetobj[selectedFirstTime][selectedSecondTime].kv["Nordrhein"][rv] == undefined){
                      csvKV += "";
                }else{
                  csvKV += datasetobj[selectedFirstTime][selectedSecondTime].kv["Nordrhein"][rv];
                }
                csvKV += rowDelim;
            }else if(zoomedStateKV == "Westfalen-Lippe"){
                german ? (csvKV += '"'+"Westfalen-Lippe"+'"') : (csvKV += '"'+"Westphalia-Lippe"+'"');
                csvKV += colDelim;
                if(datasetobj[selectedFirstTime][selectedSecondTime].kv["Westfalen-Lippe"][rv] == undefined){
                      csvKV += "";
                }else{
                  csvKV += datasetobj[selectedFirstTime][selectedSecondTime].kv["Westfalen-Lippe"][rv];
                }
                csvKV += rowDelim;
            }else{
                german ? (csvKV += '"'+"Nordrhein"+'"') : (csvKV += '"'+"North Rhine"+'"');
                csvKV += colDelim;
                if(datasetobj[selectedFirstTime][selectedSecondTime].kv["Nordrhein"][rv] == undefined){
                      csvKV += "";
                }else{
                  csvKV += datasetobj[selectedFirstTime][selectedSecondTime].kv["Nordrhein"][rv];
                }
                csvKV += rowDelim;

                german ? (csvKV += '"'+"Westfalen-Lippe"+'"') : (csvKV += '"'+"Westphalia-Lippe"+'"');
                csvKV += colDelim;
                if(datasetobj[selectedFirstTime][selectedSecondTime].kv["Westfalen-Lippe"][rv] == undefined){
                      csvKV += "";
                }else{
                  csvKV += datasetobj[selectedFirstTime][selectedSecondTime].kv["Westfalen-Lippe"][rv];
                }
                csvKV += rowDelim;
            }
        }

      }

      var csvData;

    if(blPressed == 0){ // county representation
        csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
    }else if(blPressed == 1){ // state representation
        csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvBL);
    }else if(blPressed == 2){ // kv representation
        csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvKV);
    }

    // For IE (tested 10+)
      if (window.navigator.msSaveOrOpenBlob) {
          var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
              type: "text/csv;charset=utf-8;"
          });
          navigator.msSaveBlob(blob, filename);
      } else {
          $(this)
              .attr({
                  'download': filename
                  ,'href': csvData
                  //,'target' : '_blank' //if you want it to open in a new window
          });
      }
  }

  // actual download function which calls exportToCSV()
  $('.export').click(function (event) {

    // for filename
    if(selectedCategories == category1){
        german ? impf = categoriesObj[datasetname].german.category1.replace(" ", "").replace(".", "") : impf = categoriesObj[datasetname].english.category1.replace(" ", "").replace(".", "");
    }else{
        german ? impf = categoriesObj[datasetname].german.category2.replace(" ", "").replace(".", "") : impf = categoriesObj[datasetname].english.category2.replace(" ", "").replace(".", "");
    }

    if(blPressed == 1){
        german ? ort = "Bundeslaender" : ort = "States";
    }else if(blPressed == 0){
        german ? ort = "Landkreise" : ort = "Counties";
    } else if(blPressed == 2){
        german ? ort = "KV" : ort = "ASHIP";
    }

    if(zoomed){
        if((blPressed == 0 && !zoomedStateKV)|| blPressed == 1 || (blPressed == 2 && !zoomedStateKV)){
            if(german || statesEnObj[zoomedState] == null){
               placeholderZoom = "_" + zoomedState.replace(/ /g, "");
            }else{
               placeholderZoom = "_" + statesEnObj[zoomedState].replace(/ /g, "");
            }
        }else if(blPressed == 2 && zoomedStateKV){
            if(german || statesEnObj[zoomedStateKV] == null){
               placeholderZoom = "_" + zoomedStateKV.replace(/ /g, "");
            }else{
               placeholderZoom = "_" + statesEnObj[zoomedStateKV].replace(/ /g, "");
            }
        }else if(blPressed == 0 && zoomedStateKV){
            if(german || statesEnObj[zoomedStateKV] == null){
               placeholderZoom = "_" + zoomedStateKV.replace(/ /g, "");
            }else{
               placeholderZoom = "_" + statesEnObj[zoomedStateKV].replace(/ /g, "");
            }
        }
    }else{
        placeholderZoom = "";
    }
    if(datasetname == "dataMeasles"){
        dset = german ? "Masern_" : "Measles_";
        unitset =  german ? "Monate_" : "Months_";
    }else if(datasetname == "rotavirus"){
        dset = "Rotavirus_";
        unitset =  german ? "Wochen_" : "Weeks_";
    }

    if(german){
        var outputFile = dset + "Impfquoten_"+ ort + "_" + selectedFirstTime + "_" + selectedSecondTime + unitset + impf + placeholderZoom;
    }else{
        var outputFile = dset + "VacRates_"+ ort + "_" + selectedFirstTime + "_" + selectedSecondTime + unitset + impf + placeholderZoom;
    }

    outputFile = outputFile.replace('.csv','') + '.csv';

    exportToCSV.apply(this, [outputFile]);

  });
});

// dataset button
$("li.measles").click(function(){
    datasetobj = dataMeasles;
    datasetname = "dataMeasles";
    // initialization variables
    initializationData(datasetname, datasetobj);
    // update selector table
    buildSelectorTable();
    // update map and bar charts
    clickBox0("#m"+selectedFirstTime,selectedFirstTime);
    // info text and links
    if(german){
        $('.german.rotavirus').css("display", "none");
        $('.german.measles').css("display", "block");
    }else{
        $('.english.rotavirus').css("display", "none");
        $('.english.measles').css("display", "block");
    }
    // change legend
    changeColorKey();
})

$("li.rotavirus").click(function(){
    datasetobj = rotavirus;
    datasetname = "rotavirus";
    // initialization variables
    initializationData(datasetname, datasetobj);
    // update selector table
    buildSelectorTable();
    // update map and bar charts
    clickBox0("#m"+selectedFirstTime,selectedFirstTime);
    // info text and links
    if(german){
        $('.german.rotavirus').css("display", "block");
        $('.german.measles').css("display", "none");
    }else{
        $('.english.rotavirus').css("display", "block");
        $('.english.measles').css("display", "none");
    }
    // change legend
    changeColorKey();
})

// ======= selector ========

/**
* Checks if there is no data for the combination of selected birth cohort, age-group and vaccination dose.
* If there is no data, belonging property of object "empty" gets true.
* Afterward, in "check" object the property belonging to the selected birth cohort gets true.
* @see empty
* @see check
* @function checkIfEmpty
*/
function checkIfEmpty(){

    for(months in empty[selectedFirstTime]){
        for(cats in categories){

            var numberOfArgs = Object.keys(datasetobj[selectedFirstTime][months].counties).length;
            var numberOfEmptyArgs = 0;

            for(args in datasetobj[selectedFirstTime][months].counties){
                if(datasetobj[selectedFirstTime][months].counties[args][roundValue(datasetname , months, categories[cats])] == undefined){
                        numberOfEmptyArgs += 1;
                    }
            }

            if(numberOfArgs == numberOfEmptyArgs){
                empty[selectedFirstTime][months][categories[cats]] = true;
            }
        }
    }
    check[selectedFirstTime] = true;
}


/**
* Initialization for menu
* @function buildSelectorTable
*/
function iniBuildSelectorTable(){
    //table header
    box0.append("tr").append("td").text(jahrgang).attr("class", "tableheader");
    box1.append("tr").append("td").text(altersgruppe).attr("class", "tableheader");
    box2.append("tr").append("td").text(kategorie).attr("class", "tableheader");
}

/**
*
* @function clickBox0
* @param {string} selectThis element or id of element
* @param {string} d birth cohort which gets selected
* @see buildSelectorTable
*/
function clickBox0(selectThis, d){
    //overwriting the variables
    selectedFirstTime = d;
    ptv = datasetobj[selectedFirstTime][selectedSecondTime].counties;

    //if it didn't check it yet, it checks if there is data for selection
    if(check[selectedFirstTime] == false){
       checkIfEmpty();
    }

    //it does not need to check if birth cohort is empty because on purpose it is never empty. The age-groups and categories are depending on their birth cohort.

    d3.selectAll(".box1_empty").attr("class", "box1");
    d3.selectAll("#secondTime .boxRow td").attr("class", function(d){
        if(d == selectedSecondTime){return "box1_selected"};
        return empty[selectedFirstTime][d][selectedCategories] == false ? "box1" : "box1_empty";
    });
    d3.selectAll(".box0_selected").attr("class", "box0"); //previous selected box gets unselected
    d3.select(selectThis).attr("class", "box0_selected"); //new selected box gets selected

    changeColor(selectedFirstTime, selectedSecondTime, selectedCategories); //for county representation
    if(blPressed == 1){changeColorBl(selectedFirstTime, selectedSecondTime);} //for state representation
    if(blPressed == 2){changeColorKv(selectedFirstTime, selectedSecondTime);} //for kv representation

    orderLKs(); //reorders counties
    orderBLs(); //reorders states
    orderKVs(); //reorders aships
    meanDataBuilder(); //gets new nationwide average
    makeBarchart({}, {}, "#barchartMeanPosition","barchartMean",meanData, meanData.length, "state", "ordered", 4); //makes bar chart of nationwide average
    makeBarchart({}, {}, "#barchart0Position","barchart0",orderedBl, orderedBl.length, "state", "ordered", 4); //makes bar chart of ranking of federal states
    makeBarchart({}, {}, "#barchartKVPosition","barchartkv",orderedKv, orderedKv.length, "state", "ordered", 4); //makes bar chart of ranking of aships
    d3.selectAll(".polySelected").select("path").style("fill", "none"); //hides little triangle on the left of the bars

    //changes color of elements in age-group, depending on if they exist or not
    d3.selectAll("#secondTime .boxRow td").style("color", function(d){
        return empty[selectedFirstTime][d][selectedCategories] == false ? "black" : "lightgrey";
    });

    //this sets the active selection to the next possible age-group if there is no data for the first one
    //e.g. if birth cohort is changed which has no data for current age-group: age-group changes to youngest possible age-group
    if(empty[selectedFirstTime][selectedSecondTime][selectedCategories] == true){
        for(args in empty[selectedFirstTime]){
            if(empty[selectedFirstTime][args][selectedCategories] == false){
                selectedSecondTime = args;
                clickBox1("#m"+args, selectedSecondTime);
                break;
            }
        }
    }
}

/**
*
* @function clickBox1
* @param {string} selectThis element or id of element
* @param {string} d age-group which gets selected
* @see buildSelectorTable
*/
function clickBox1(selectThis, d){
    selectedSecondTime = d;
    ptv = datasetobj[selectedFirstTime][selectedSecondTime].counties;

    if(check[selectedFirstTime] == false){
       checkIfEmpty();
    }
    if(empty[selectedFirstTime][selectedSecondTime][selectedCategories] == false){

        d3.selectAll(".box2_empty").attr("class", "box2");
        d3.selectAll("#categories .boxRow td").attr("class", function(d){
            if(d == selectedCategories){return "box2_selected"};
            return empty[selectedFirstTime][selectedSecondTime][d] == false ? "box2" : "box2_empty";
        });
        d3.selectAll(".box1_selected").attr("class", "box1");
        d3.select(selectThis).attr("class", "box1_selected");
        rv = roundValue(datasetname ,selectedSecondTime, selectedCategories);
        changeColor(selectedFirstTime, selectedSecondTime, selectedCategories);
        if(blPressed == 1){
            changeColorBl(selectedFirstTime, selectedSecondTime);
        }
        if(blPressed == 2){
            changeColorKv(selectedFirstTime, selectedSecondTime);
        }
        orderLKs();
        orderBLs();
        orderKVs(); //reorders aships
        meanDataBuilder();
        makeBarchart({}, {}, "#barchartMeanPosition","barchartMean",meanData, meanData.length, "state", "ordered", 4);
        makeBarchart({}, {}, "#barchart0Position","barchart0",orderedBl, orderedBl.length, "state", "ordered", 4);
        makeBarchart({}, {}, "#barchartKVPosition","barchartkv",orderedKv, orderedKv.length, "state", "ordered", 4);
        d3.selectAll(".polySelected").select("path").style("fill", "none");

        //changes color of elements in categories depending on if they exist or not
        d3.selectAll("#categories .boxRow td").style("color", function(d){
            return empty[selectedFirstTime][selectedSecondTime][d] == false ? "black" : "lightgrey";
        });
    }
}
/**
*
* @function clickBox2
* @param {string} selectThis element or id of element
* @param {string} d category which gets selected
* @see buildSelectorTable
*/
function clickBox2(selectThis, d){
    selectedCategories = d;

    if(check[selectedFirstTime] == false){
       checkIfEmpty();
    }
    if(empty[selectedFirstTime][selectedSecondTime][selectedCategories] == false ){
        d3.selectAll(".box1_empty").attr("class", "box1");
        d3.selectAll("#secondTime .boxRow td").attr("class", function(d){
            if(d == selectedSecondTime){return "box1_selected"};
            return empty[selectedFirstTime][d][selectedCategories] == false ? "box1" : "box1_empty";
        });
        d3.selectAll(".box2_selected").attr("class", "box2");
        d3.select(selectThis).attr("class", "box2_selected");
        rv = roundValue(datasetname, selectedSecondTime, selectedCategories);
        changeColor(selectedFirstTime, selectedSecondTime, selectedCategories);
        if(blPressed == 1){
            changeColorBl(selectedFirstTime, selectedSecondTime);
        }
        if(blPressed == 2){
            changeColorKv(selectedFirstTime, selectedSecondTime);
        }
        orderLKs();
        orderBLs();
        orderKVs(); //reorders aships
        meanDataBuilder();
        makeBarchart({}, {}, "#barchartMeanPosition","barchartMean",meanData, meanData.length, "state", "ordered", 4);
        makeBarchart({}, {}, "#barchart0Position","barchart0",orderedBl, orderedBl.length, "state", "ordered", 4);
        d3.selectAll(".polySelected").select("path").style("fill", "none");

        //changes color of elements in age-group depending on if they exist or not
        d3.selectAll("#secondTime .boxRow td").style("color", function(d){
            return empty[selectedFirstTime][d][selectedCategories] == false ? "black" : "lightgrey";
        });
    }
}

/**
* Builds the menu
* @function buildSelectorTable
*/
function buildSelectorTable(){
    // menu for birth cohorts
    // data join and update
    var menueFirstTime = box0.selectAll(".boxRow").data(firstTime, function(e){return e;});

    menueFirstTime.selectAll("td")
        .attr("class", function(d){
            //if it didn't check it yet, it checks if there is data for selection
            if(check[selectedFirstTime] == false){
               checkIfEmpty();
            }
            //class gets name "box0_selected" if it is current selection, otherwise "box0", or "box0_empty" if there is no data
            if(empty[d][selectedSecondTime][selectedCategories] == false){
                return d == selectedFirstTime ? "box0_selected" : "box0";
            }else{
                return "box0_empty";
            }
        })
        .attr("id", function(d){return "m"+d;}) //id cannot start with integer
        .on("click", function(d) {
            clickBox0(this, d);
        })
        .text(function(d) {
            return d;
        });

    // exit
    menueFirstTime.exit().remove();

    // enter
    var menueFirstTimeEnter = menueFirstTime.enter()
        .append("tr").attr("class", "boxRow")
        .append("td").attr("class", function(d){
            //if it didn't check it yet, it checks if there is data for selection
            if(check[selectedFirstTime] == false){
               checkIfEmpty();
            }
            //class gets name "box0_selected" if it is current selection, otherwise "box0", or "box0_empty" if there is no data
            if(empty[d][selectedSecondTime][selectedCategories] == false){
                return d == selectedFirstTime ? "box0_selected" : "box0";
            }else{
                return "box0_empty";
            }
        })
        .attr("id", function(d){return "m"+d;}) //id cannot start with integer
        .on("click", function(d) {
            clickBox0(this, d);
        })
        .text(function(d) {
            return d;
        });

    // data join and update
    var menueSecondTime =  box1.selectAll(".boxRow").data(secondTime, function(e){return e;});
    menueSecondTime.selectAll("td")
        .attr("class", function(d) {
            if(check[selectedFirstTime] == false){
               checkIfEmpty();
            }
            if(empty[selectedFirstTime][d][selectedCategories] == false){
                return d == selectedSecondTime ? "box1_selected" : "box1";
            }else{
                return "box1_empty";
            }
        })
        .attr("id", function(d){return "m"+d;})
        .on("click", function(d) {
            clickBox1(this, d);
        })
        .text(function(d) {
            return (datasetname == "dataMeasles") ? (german? d + " Monate" : d + " months") : (german? d + " Wochen" : d + " weeks") ;
        })
        .style("color", function(d){
            if(check[selectedFirstTime] == false){
               checkIfEmpty();
            }
            return empty[selectedFirstTime][d][selectedCategories] == false ? "black" : "lightgrey";
        });

    // exit
    menueSecondTime.exit().remove();

    // enter
    var menueSecondTimeEnter = menueSecondTime.enter()
        .append("tr").attr("class", "boxRow")
        .append("td").attr("class", function(d) {
            if(check[selectedFirstTime] == false){
               checkIfEmpty();
            }
            if(empty[selectedFirstTime][d][selectedCategories] == false){
                return d == selectedSecondTime ? "box1_selected" : "box1";
            }else{
                return "box1_empty";
            }
        })
            .attr("id", function(d){return "m"+d;})
        .on("click", function(d) {
            clickBox1(this, d);
        })
        .text(function(d) {
            return (datasetname == "dataMeasles") ? (german? d + " Monate" : d + " months") : (german? d + " Wochen" : d + " weeks") ;
        })
        .style("color", function(d){
            if(check[selectedFirstTime] == false){
               checkIfEmpty();
            }
            return empty[selectedFirstTime][d][selectedCategories] == false ? "black" : "lightgrey";
        });

    // data join and update
    var menueCategories = box2.selectAll(".boxRow").data(categories, function(e){return e;});
    menueCategories.selectAll("td")
        .attr("class", function(d) {
            if(check[selectedFirstTime] == false){
               checkIfEmpty();
            }
            if(empty[selectedFirstTime][selectedSecondTime][d] == false){
                return d == selectedCategories ? "box2_selected" : "box2";
            }else{
                return "box2_empty";
            }
        })
        .attr("id", function(d){return "m"+d.replace(" ", "");})
        .on("click", function(d) {
            clickBox2(this, d);
        })
        .text(function(d) {
            return d;
        })
        .style("color", function(d){
            if(check[selectedFirstTime] == false){
               checkIfEmpty();
            }
            return empty[selectedFirstTime][selectedSecondTime][d] == false ? "black" : "lightgrey";
        });

    // exit
    menueCategories.exit().remove();

    // enter
    var menueCategoriesEnter = menueCategories.enter()
        .append("tr").attr("class", "boxRow")
        .append("td").attr("class", function(d) {
            if(check[selectedFirstTime] == false){
               checkIfEmpty();
            }
            if(empty[selectedFirstTime][selectedSecondTime][d] == false){
                return d == selectedCategories ? "box2_selected" : "box2";
            }else{
                return "box2_empty";
            }
        })
            .attr("id", function(d){return "m"+d.replace(" ", "");})
        .on("click", function(d) {
            clickBox2(this, d);
        })
        .text(function(d) {
            return d;
        })
        .style("color", function(d){
            if(check[selectedFirstTime] == false){
               checkIfEmpty();
            }
            return empty[selectedFirstTime][selectedSecondTime][d] == false ? "black" : "lightgrey";
        });
}
/**
* changes color of counties, bars and legend
* @function changeColor
* @param {string} selectedFirstTime current birth cohort
* @param {string} selectedSecondTime current age-group
* @param {string} selectedCategories current vaccination dose
* @see color
*/
function changeColor(selectedFirstTime, selectedSecondTime, selectedCategories) {
    d3.selectAll(".subunit").transition().duration(500)
        .style("fill", function(d){
            return color(ptv[d.id][roundValue(datasetname, selectedSecondTime,selectedCategories)]);
        });
}

/**
* changes color of states
* @function changeColorBl
* @param {string} selectedFirstTime current birth cohort
* @param {string} selectedSecondTime current age-group
* @see color
*/
function changeColorBl(selectedFirstTime, selectedSecondTime){
    d3.selectAll(".states").transition().duration(500)
        .style("fill", function(d){
            return color(datasetobj[selectedFirstTime][selectedSecondTime].states[d.properties.name][rv])
        });
}

/**
* changes color of KV (=ASHIP)
* @function changeColorKv
* @param {string} selectedFirstTime current birth cohort
* @param {string} selectedSecondTime current age-group
* @see color
* @see changeColorBl
* @todo transition and duration leads to a bug by clicking the bllkswitch very fast
*/
function changeColorKv(selectedFirstTime, selectedSecondTime){
    //KV representation only differs in North Rhine-Westphalia
    changeColorBl(selectedFirstTime, selectedSecondTime);
    d3.selectAll(".kv").style("stroke", "#777");

/**todo: transition and duration leads to a bug by clicking the bllkswitch very fast*/
    d3.selectAll(".kv.nordrhein")
        .transition().duration(500)
        .style("fill", color(datasetobj[selectedFirstTime][selectedSecondTime].kv["Nordrhein"][rv]));

    d3.selectAll(".kv.westfalen-lippe")
        .transition().duration(500)
        .style("fill", color(datasetobj[selectedFirstTime][selectedSecondTime].kv["Westfalen-Lippe"][rv]));
}

/**
* to rank states, counties, etc.
* @function compare_first_element
* @param {integer} a
* @param {integer} b
* @see orderLKs
* @see orderBLs
*/
function compare_first_element(a,b) {
        return a[valueName] < b[valueName] ? 1 : a[valueName] > b[valueName] ? -1 : 0;
}

/**
* prototype to store ranking list of federal state and its English name
* @func Ordered
* @param {string} state federal state
* @param {object|integer} ordered contains round value(s) for ranking
* @param {string} stateEN English name if any
* @see orderLKs
* @see orderBLs
* @see meanDataBuilder
*/
function Ordered(state,ordered,stateEN){
        this.state = state;
        this.ordered = ordered;
        this.stateEN = stateEN;
}

/**
* Generates "ordered", an array of 16 objects for each federal state with properties state, ordered and stateEN (undefined). In the property ordered all counties of the belonging state are sorted in descending order.
* @generator
* @func orderLKs
* @yields {array} ordered
*/

function orderLKs(){
    var bl = []; //array of federal states + ASHIPs of North Rhine-Westphalia
    ordered = [];
    valueName = rv;

    for (var i = 0; i < states.features.length; i++) {
        bl.push(states.features[i].properties.name);
    };
    bl.push("Nordrhein");
    bl.push("Westfalen-Lippe");

    for (var i = 0; i < bl.length; i++) {
        ordered[i] = [];

        for (var j = 0; j < featuresCB.length; j++) {
            if(featuresCB[j].properties.state == bl[i]){
                ordered[i].push(ptv[featuresCB[j].id]);
            }else if(nordrhein.has(makePrefix(featuresCB[j])) && bl[i]=="Nordrhein"){
                ordered[i].push(ptv[featuresCB[j].id]);
            }else if(westfalenLippe.has(makePrefix(featuresCB[j])) && bl[i]=="Westfalen-Lippe"){
                ordered[i].push(ptv[featuresCB[j].id]);
            }
        }
        ordered[i].sort(compare_first_element);
        ordered[i] = new Ordered(bl[i],ordered[i]);
    };
}

/**
* Generates "orderedBl", an array of 16 objects for each federal state with properties state, ordered and stateEN. The property ordered is its round value.
* @generator
* @func orderBLs
* @yields {array} orderedBl
*/
function orderBLs(){
    var bl = [];
    var c = 0; //to handle indices of states with no data
    orderedBl = [];

    for (var i = 0; i < states.features.length; i++) {
        bl.push(states.features[i].properties.name);
    };
    var pathToStates = datasetobj[selectedFirstTime][selectedSecondTime].states;
    for (var i = 0; i < bl.length; i++) {
        if(pathToStates[bl[i]][roundValue(datasetname, selectedSecondTime,selectedCategories)] == undefined){
            c++;
        }else{
            orderedBl[i-c]= new Ordered(bl[i],pathToStates[bl[i]][roundValue(datasetname, selectedSecondTime,selectedCategories)],statesEnObj[bl[i]]);
        }
    };
    valueName = "ordered";
    orderedBl.sort(compare_first_element);
}

/**
* Generates "orderedKv", an array of 17 objects for each ASHIP with properties state, ordered and stateEN. The property ordered is its round value.
* @generator
* @func orderKVs
* @yields {array} orderedKv
*/
function orderKVs(){
    var kv = [];
    var c = 0; //to handle indices of ASHIPs with no data
    orderedKv = [];

    for (var i = 0; i < states.features.length; i++) {
        kv.push(states.features[i].properties.name);
    };

    kv.push("Nordrhein");
    kv.push("Westfalen-Lippe");

    function removeFromArray(array, item, index) {
      while((index = array.indexOf(item)) > -1) {
        array.splice(index, 1);
      }
    }
    removeFromArray(kv,"Nordrhein-Westfalen");

    var pathToStates = datasetobj[selectedFirstTime][selectedSecondTime].kv;
    for (var i = 0; i < kv.length; i++) {
        if(pathToStates[kv[i]][roundValue(datasetname, selectedSecondTime,selectedCategories)] == undefined){
            c++;
        }else{
            orderedKv[i-c]= new Ordered(kv[i],pathToStates[kv[i]][roundValue(datasetname, selectedSecondTime,selectedCategories)],statesEnObj[kv[i]]);
        }
    };
    valueName = "ordered";
    orderedKv.sort(compare_first_element);
}


/**
* Generates "meanData", an array of one object for Germany with properties state, ordered and stateEN (undefined). The property ordered is its round value.
* @generator
* @func meanDataBuilder
* @yields {array} meanData
*/
function meanDataBuilder(){
    var pathToMean = datasetobj[selectedFirstTime][selectedSecondTime].germany[rv];

    if(pathToMean == undefined){
        meanData = []; //for transition no data - data
    }else{
        meanData = [new Ordered("Deutschland", pathToMean)];
    }
}

function changeColorKey(){
  legendG.selectAll("rect")
  .attr("stroke", function(d){
      return color((max()*((d+1)/max())));})
  .attr("fill", function(d){
      return color((max()*((d+1)/max())));
  });
}

/**
* gets the maximum from the colorScale domain
* @func max
* @returns 100
* @see color
*/
function max(){return colorScale.domain()[2];};
/**
* gets the minimum from the colorScale domain
* @func min
* @returns 0
* @see color
*/
function min(){return colorScale.domain()[0];};
