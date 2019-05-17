document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById('btnSearch').addEventListener('click', validate, false)
    document.getElementById('btnClear').addEventListener('click', clearTable, false)

    class Book {
        constructor(title, publisher, published, pages, isbns, description, genre, link, author) {
            this.title = title;
            this.publisher = publisher;
            this.published = published;
            this.pages = pages;
            this.isbns = isbns;
            this.description = description;
            this.genre = genre;
            this.link = link;
            this.author = author;
        }
    }

    function getBookDetails(isbn) {
        var xmlhttp = new XMLHttpRequest();
        var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var results = JSON.parse(xmlhttp.responseText);
                callback(results);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function callback(results) {
        var count = results.totalItems;
        var booksRaw = [];
        var books = [];

        validateResults(count);

        results.items.forEach(function (item) {
            var volume = item.volumeInfo;
            var bookRaw = new Array();
            booksRaw.push(volume);
            booksRaw.push(bookRaw);
        });

        booksRaw.forEach(function (item) {
            if (item.title != undefined) {
                let book = new Book(getValue(item.title),
                    getValue(item.publisher),
                    getValue(item.publishedDate),
                    getValue(item.pageCount),
                    getIsbns(item.industryIdentifiers),
                    getValue(item.description),
                    getValue(item.categories[0]),
                    getValue(item.canonicalVolumeLink),
                    getValue(item.authors[0]));

                if (books.length == 0 || (books.length > 0 && CheckIfDuplicate(book, books) == false)) {
                    books.push(book);
                }
            }               
        });

        CreateTable(books);
    }

    function getValue(itemValue) {
        if (itemValue != null && itemValue != undefined) {
            return itemValue;
        }
        else {
            return "";
        }
    }

    function getIsbns(arr) {
        if (arr != null && arr != undefined) {
            var isbn_13 = "";
            var isbn_10 = "";

            arr.forEach(function (item) {
                if (item.type == "ISBN_13") {
                    isbn_13 = item.identifier;
                }
                else if (item.type == "ISBN_10") {
                    isbn_10 = item.identifier;
                }
            });

            return isbn_13 + ", " + isbn_10;
        }
        else {
            return "";
        }
    }

    function CheckIfDuplicate(book, books) {
        books.forEach(function (item) {
            if (book.toString() == item.toString()) {
                return true;
            }
            else {
                return false;
            }

        });
    }

    function CreateTable(books) {
        var dataitems = [];
        books.forEach(function (item) {
            var data = [];
            data.push(item.title,
                      item.publisher,
                      item.published,
                      item.pages,
                      item.isbns,
                      item.description,
                      item.genre,
                      '<a href="' + item.link + '" target="_blank">View</a>',
                      item.author);
            dataitems.push(data);
        });

        var table = document.getElementById('Books').getElementsByTagName('tbody')[0];
        if (dataitems.length > 0)
        {
            var divTable = document.getElementById('divTable');
            divTable.className = "visible";
        }

        for (var i = 0; i < dataitems.length; i++) {
             //create a new row
            var newRow = table.insertRow(table.rows.length);

            for (var j = 0; j < dataitems[i].length; j++) {
                 //create a new cell
                var cell = newRow.insertCell(j);
                 //add value to the cell
                cell.innerHTML = dataitems[i][j];
            }
        }
    }  

    function validate()
    {
        var isbn = document.getElementById('isbn').value; //"9780439023528" test isbn;
        var isbnValidate = document.getElementById('isbnValidate');

        if (isbn == null || isbn == undefined || isbn == '') {
            var isbnValidate = document.getElementById('isbnValidate');
            isbnValidate.innerHTML = 'ISBN Number is required';
            isbnValidate.className = "visible required";
            return false;
        }
        else
        {
            isbnValidate.className = "invisible"; 
            getBookDetails(isbn);
        }        
    }

    function clearTable() {
        var table = document.getElementById('Books').getElementsByTagName('tbody')[0];
        var divTable = document.getElementById('divTable');
        table.innerHTML = "";
        divTable.className = "invisible";        
    }

    function validateResults(count)
    {
        switch (count) {
            case 0:
                var isbn = document.getElementById('isbn').value;
                isbnValidate.innerHTML = 'There were no results found for ISBN ' + isbn;
                isbnValidate.className = "visible required";
                break;
        }
    }

});