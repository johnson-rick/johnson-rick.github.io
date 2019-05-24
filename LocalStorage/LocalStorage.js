document.addEventListener("DOMContentLoaded", function (event) {
    //localStorage.clear();
    var hasIsbns = checkForArray('isbns');
    
    if (hasIsbns == true)
    {
        var isbns = getItemFromStorage('isbns');
        if (isbns != null && isbns != undefined)
        {
            for (var i = 0; i < isbns.length; i++) {
                var isbn = isbns[i];
                var book = [];
                var item = getItemFromStorage(isbn);

                if (item != null && book != undefined)
                {
                    book.push(getItemFromStorage(isbn));
                    CreateTable(book);
                }
            }
        }
        //console.log(isbns);
    }

    function checkForArray(keyName)
    {
        if (localStorage.getItem(keyName) != null || localStorage.getItem(keyName) != undefined) {
            return true;
        }
        else
        {
            return false;
        }
    }

    function setItemInStorage(dataKey, data) {
        localStorage.setItem(dataKey, JSON.stringify(data));
    }

    function getItemFromStorage(dataKey) {
        var data = localStorage.getItem(dataKey);
        return data ? JSON.parse(data) : null;
    }

    Storage.prototype.getArray = function (arrayName) {
        var thisArray = [];
        var fetchArrayObject = this.getItem(arrayName);

        if (typeof fetchArrayObject !== 'undefined') {
            if (fetchArrayObject !== null)
            {
                thisArray = JSON.parse(fetchArrayObject);
            }
        }
        return thisArray;
    }

    Storage.prototype.pushArrayItem = function (arrayName, arrayItem) {
        var existingArray = this.getArray(arrayName);

        existingArray.push(arrayItem);
        this.setItem(arrayName, JSON.stringify(existingArray));
    }

    Storage.prototype.popArrayItem = function (arrayName) {
        var arrayItem = {};
        var existingArray = this.getArray(arrayName);

        if (existingArray.length > 0)
        {
            arrayItem = existingArray.pop();
            this.setItem(arrayName, JSON.stringify(existingArray));
        }

        return arrayItem;
    }

    Storage.prototype.shiftArrayItem = function (arrayName) {
        var arrayItem = {};
        var existingArray = this.getArray(arrayName);

        if (existingArray.length > 0) {
            arrayItem = existingArray.shift();
            this.setItem(arrayName, JSON.stringify(existingArray));
        }

        return arrayItem;
    }

    Storage.prototype.unshiftArrayItem = function (arrayName, arrayItem) {
        var existingArray = this.getArray(arrayName);
        existingArray.unshift(arrayItem);
        this.setItem(arrayName, JSON.stringify(existingArray));
    }

    Storage.prototype.deleteArray = function (arrayName) {
        this.removeItem(arrayName);
    }

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
                    var isbn = document.getElementById('isbn').value;
                    setItemInStorage(isbn, book);
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
                    insertIsbn(item.identifier)
                }
                else if (item.type == "ISBN_10") {
                    isbn_10 = item.identifier;
                    insertIsbn(item.identifier)
                }
            });

            return isbn_13 + ", " + isbn_10;
        }
        else {
            return "";
        }
    }

    function insertIsbn(isbnValue)
    {
        var isbns = getItemFromStorage('isbns'); 
        var isDuplicate = new Boolean(false);

        if (hasIsbns == true) {

            if (isbns != null && isbns != undefined)
            {
                isDuplicate = Boolean(CheckIfDuplicate(isbnValue, isbns));
            } 

            if (!(Boolean(isDuplicate)))
            {
                localStorage.pushArrayItem('isbns', isbnValue);
                localStorage.pushArrayItem('isbnsMaster', isbnValue);
            }            
        }
        else {
            var isbns = [];

            isbns.push(isbnValue);
            setItemInStorage('isbns', isbns);
            hasIsbns = true;
        } 
    }

    function CheckIfDuplicate(book, books) {
        var count = 0;

        books.forEach(function (item) {
            if (book.toString() == item.toString()) {
                count = count + 1;
            }
        });

        return Boolean(count);
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
        var isbnNew = document.getElementById('isbn').value; //"9780439023528" test isbn;
        var isbnValidate = document.getElementById('isbnValidate');

        var isbns = getItemFromStorage('isbns');
        if (isbns != null && isbns != undefined) {
            for (var i = 0; i < isbns.length; i++) {
                var isbnExisting = isbns[i];         

                if (isbnExisting != null && isbnExisting != undefined)
                {
                    if (isbnNew.toString() == isbnExisting.toString())
                    {
                        isbnValidate.innerHTML = "The ISBN: " + isbnNew + " already exists in the results.";
                        isbnValidate.className = "visible required";
                        return;
                    }
                }
            }
        }
        
        if (isbnNew == null || isbnNew == undefined || isbnNew == '') {
            var isbnValidate = document.getElementById('isbnValidate');
            isbnValidate.innerHTML = 'ISBN Number is required';
            isbnValidate.className = "visible required";
            return false;
        }
        else
        {
            isbnValidate.className = "invisible"; 
            getBookDetails(isbnNew);
        }        
    }

    function clearTable() {
        var table = document.getElementById('Books').getElementsByTagName('tbody')[0];
        var divTable = document.getElementById('divTable');
        table.innerHTML = "";
        divTable.className = "invisible";    
        localStorage.clear();
        location.reload();
    }

    function validateResults(count)
    {
        var isbn = document.getElementById('isbn').value;
        switch (count) {
            case 0:                
                isbnValidate.innerHTML = 'There were no results found for ISBN ' + isbn;
                isbnValidate.className = "visible required";
                break;
        }
    }
});

