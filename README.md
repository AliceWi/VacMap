# VacMap
interactive map for visualizing coverage of vaccination

to find at www.vacmap.de

compatible with Firefox, Google Chrome, Safari and IE

## Files

### germany_23_6_17_ohneBerlin.json 
topojson data of Germany, see also my [TopoJSON-Germany repo](https://github.com/AliceWi/TopoJSON-Germany)

### measles050218.js, rotaviren.js 
data files, import variables dataMeasles and rotavirus, not contained in this repo

### /D3lib 
library, includes [bootstrap](https://getbootstrap.com/), [d3.js](https://d3js.org/), [jquery](https://jquery.com/) and [topojson](https://github.com/topojson/topojson)

### /jsdoc
documentary, made with love and [JSDoc](http://usejsdoc.org/)

### offcanvas.css 
css for behavior of menu and buttons when window gets resized

## data

### where to get
Data can be downloaded as .csv at www.vacmap.de 

See also [database of cases of notifiable diseases](https://survstat.rki.de/) of the Robert Koch Institute. 

### object structure

```
var variName = {
  "2014":{ //birth cohort
    "24":{ // age-group
      "states":{
        "Bremen":{
          "year":2014,
          "bl":"Bremen", // Bundesland = state
          "vc_mas1_24m_round":42, //category 1
          "vc_mas2_24m_round":42 //category 2
        },"Rheinland-Pfalz":{ ...
        }, ...
      },"counties":{
        "11001":{ // five digit Community Identification Number
          "year":2014,
          "bl":"Berlin",
          "kkz":"11001", // Kreiskennzeichen = five digit Community Identification Number
          "lk":"SK Berlin Mitte", // Landkreis = county
          "kv":"Berlin", // Krankenkassenverband = ASHIP
          "vc_mas1_24m_round":42,
          "vc_mas2_24m_round":42
        },"11002":{ ...
        }, ...
      },"germany":{
        "year":2014,
        "vc_mas1_24m_round":42,
        "vc_mas2_24m_round":42
      },"kv":{
        "Bremen":{
          "year":2014,
          "kv":"Bremen",
          "bl":"Bremen",
          "vc_mas1_24m_round":42,
          "vc_mas2_24m_round":42
        },"Rheinland-Pfalz":{ ...
        }, ...
      }
    },
    "36":{
      ...
    }, ...
  }, "2015": {
    ...
  }, ...
}
```



