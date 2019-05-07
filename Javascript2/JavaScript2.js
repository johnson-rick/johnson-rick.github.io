document.addEventListener("DOMContentLoaded", function (event) {
    table = document.getElementById("vehicles");

    class Vehicle {
        constructor(make, model, year) {
            this.make = make;
            this.model = model;
            this.year = year;
        }
    }

    class Truck extends Vehicle {
        constructor(make, model, year, weight_class) {
            super(make, model, year);

            var _weight;

            switch (weight_class) {
                case "Class 1":
                    _weight = "Up to 6,000 Pounds";
                    break;
                case "Class 2":
                    _weight = "Between 6,001 and 10,000 Pounds";
                    break;
                case "Class 3":
                    _weight = "Between 10,001 and 14,000 Pounds";
                    break;
                case "Class 4":
                    _weight = "Between 14,001 and 16,000 Pounds";
                    break;
                case "Class 5":
                    _weight = "Between 16,001 and 19,500 Pounds";
                    break;
                case "Class 6":
                    _weight = "Between 19,501 and 26,000 Pounds";
                    break;
                case "Class 7":
                    _weight = "Between 26,001 and 33,000 Pounds";
                    break;
                case "Class 8":
                    _weight = "Between 33,001 to really huge.";
                    break;
                default:
                    _weight = "Up to 6,000 Pounds";
            }


            this.weight_class = weight_class;
            this.weight = _weight;
        }
    }

    let v1 = new Truck('Ford', 'F150', 1997, 'Class 1');
    let v2 = new Truck('Ford', 'F250', 1998, 'Class 2');
    let v3 = new Truck('Ford', 'F350', 2001, 'Class 3');
    let v4 = new Truck('Dodge', 'Ram 1500', 2001, 'Class 1');
    let v5 = new Truck('Dodge', 'Ram 2500', 2003, 'Class 2');
    let v6 = new Truck('Dodge', 'Ram 3500', 2005, 'Class 3');

    var arrTruck = [];
    arrTruck.push(v1, v2, v3, v4, v5, v6);

    var datasource1 = JSON.stringify({ 'Trucks': arrTruck });
    datasource = JSON.parse(datasource1);

    var dataitems = [];
    datasource.Trucks.forEach(function (item) {
        var data = [];
        data.push(item.make,
                  item.model,
                  item.year,
                  item.weight_class,
                  item.weight);
        dataitems.push(data);
    });

    for (var i = 0; i < dataitems.length; i++) {
        // create a new row
        var newRow = table.insertRow(table.length);
        for (var j = 0; j < dataitems[i].length; j++) {
            // create a new cell
            var cell = newRow.insertCell(j);

            // add value to the cell
            cell.innerHTML = dataitems[i][j];
        }
    }
});

