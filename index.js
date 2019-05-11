$(document).ready(function () {

    class Subject {
        constructor(sortOrder, subject, submitDate, lastUpdated, comments) {
            this.sortOrder = sortOrder;
            this.subject = subject;
            this.submitDate = submitDate;
            this.lastUpdated = lastUpdated;
            this.comments = comments;
        }
    }

    class Score extends Subject {
        constructor(sortOrder, subject, submitDate, lastUpdated, comments, score, url, action) {
            super(sortOrder, subject, submitDate, lastUpdated, comments);

            var _status;

            if (score != null && score > 9) {
                _status = "Done";
            }
            else
            {
                _status = "Not done yet!!!";
            }

            this.score = score;
            this.status = _status;
            this.url = url;
            this.action = action;
        }
    }

    let s1 = new Score(1, 'JavaScript - Loops, Conditional Statements, Functions, Variables, Parameters, Arrays, Associative Arrays', '05/10/2019', '05/10/2019', 'first attempt. please review', 0, '../Javascript1/JavaScript1.html','');
    let s2 = new Score(2, 'JavaScript Objects - Object Creation Functions, Inheritance, Properties, Methods, Instantiation', '05/10/2019', '05/10/2019', 'first attempt. please review', 0, '../Javascript2/JavaScript2.html', '');
    let s3 = new Score(3,'JSON Parse, Stringify', '05/17/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');
    let s4 = new Score(4, 'AJAX requesting a JSON file', '05/17/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');
    let s5 = new Score(5, 'Local Storage API, Storing and Retrieving Simple Data, Arrays, Associative Arrays, and Objects', '05/24/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');
    let s6 = new Score(6, 'DOM Manipulation Using createElement, appendChild, insertBefore, removeChild, etc.', '05/31/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');
    let s7 = new Score(7, 'Manipulating CSS Class Properties Using JavaScript', '05/31/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');
    let s8 = new Score(8, 'Creating CSS3 Transitions and Animations in CSS and triggering them with JavaScript', '06/07/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');
    let s9 = new Score(9, 'Standard JavaScript Events Including those for Mobile Devices(Ex.onTouchBegin, onLoad, etc.) and Animation and Transition Events', '06/07/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');
    let s10 = new Score(10, 'HTML5 Tags - Video, Audio, and Canvas', '06/14/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');
    let s11 = new Score(11, 'Designing, Defining, and Triggering CSS3 Transitions without Custom Libraries', '06/14/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');
    let s12 = new Score(12, 'Designing, Defining, and Triggering CSS3 Transforms without Custom Libraries', '06/21/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');
    let s13 = new Score(13, 'Designing, Defining, and Triggering CSS3 Animations without Custom Libraries', '06/21/2019', '', 'Not submitted yet', 0, '../Javascript2/JavaScript2.html', '');

    var arrScores = [];
    arrScores.push(s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13);

    var datasource1 = JSON.stringify({ 'Scores': arrScores });
    datasource = JSON.parse(datasource1);

    var dataItems = [];
    $.each(datasource.Scores, function (i, item) {
        var data = [];
        data.push(item.sortOrder,
                  item.subject,
                  item.submitDate,
                  item.lastUpdated,
                  item.comments,
                  item.score,
                  item.url,
                  item.action);
        dataItems.push(data);
    });

    $('#Examples').DataTable({
    order: [0, "asc"],
    data: dataItems,
        "columnDefs":
            [
                {
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [1],
                    "visible": true,
                    "searchable": true,
                    "orderable": false
                },
                {
                    "targets": [2],
                    "visible": true,
                    "searchable": true,
                    "orderable": false
                },
                {
                    "targets": [3],
                    "visible": true,
                    "searchable": true,
                    "orderable": false
                },
                {
                    "targets": [4],
                    "visible": true,
                    "searchable": true,
                    "orderable": false
                },
                {
                    "targets": [5],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [6],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [7],
                    "visible": true,
                    "searchable": false,
                    "render": function (data, type, row, meta) {
                        var x = new Date(row[2]);
                        var y = new Date();                      

                        if (+x <= +y) {
                            return '<a href="' + row[6] + '">Example Page</a>';
                        }
                        else
                        {
                            return '<a href=""></a>';
                        }
                        
                    }
                }
            ]            
    });
});

