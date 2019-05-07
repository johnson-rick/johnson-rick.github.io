document.addEventListener("DOMContentLoaded", function (event) {

    var loops = ["For Loop", "For/In Loop", "While Loop", "Do While Loop"];

    setLoops(loops);

    var button = document.getElementById('btnLoop');

    button.onclick = function () {
        var ddl = document.getElementById("Loops");
        var typeText = ddl.options[ddl.selectedIndex].text;

        RunLoopExample(typeText);
    };

    function RunLoopExample(type) {
        var text = "";
        var codeText = "";
        var code = document.getElementById('code');
        var loop = document.getElementById('loop');
        var lbl = document.getElementById('label');

        lbl.innerHTML = type;

        if (type == 'For Loop') {
            codeText = "var text = ''; var i; for (i = 0; i < 5; i++) {text += 'The number is ' + i + '<br>';";
            code.innerHTML = codeText;

            for (i = 0; i < 5; i++) {
                text += "The number is " + i + "<br>";
            }

        }
        else if (type == 'For/In Loop') {            
            codeText = "var vehicle = { make: 'Ford', model: 'Mustang', year: 1966 }; var text = ''; var i; for (i in vehicle) { text += vehicle[i] + ' '};";
            code.innerHTML = codeText;

            var vehicle = { make: "Ford", model: "Mustang", year: 1966 };

            for (i in vehicle) {
                text += vehicle[i] + " ";
            }

        }
        else if (type == 'While Loop') {
            codeText = "var text = ''; var i; while (i < 10) { text += 'The number is ' + i + '<br>'; i++;";
            code.innerHTML = codeText;

            i = 0;
            while (i < 10) {
                text += "The number is " + i + "<br>";
                i++;
            }

        }
        else if (type == 'Do While Loop') {
            codeText = "var text = ''; var i; i = 0; do { text += 'The number is ' + i+ '<br>'; i++; } while (i < 15);";
            code.innerHTML = codeText;

            i = 0;
            do {
                text += "The number is " + i + "<br>";
                i++;
            }
            while (i < 15);

        }
     
        loop.innerHTML = text;

    }

    function setLoops(loops) {
        var select = document.getElementById("Loops");

        // Optional: Clear all existing options first:
        select.innerHTML = "";
        // Populate list with options:
        for (var i = 0; i < loops.length; i++) {
            var opt = loops[i];
            select.innerHTML += "<option value=\"" + opt + "\">" + opt + "</option>";
        }
    }

});

