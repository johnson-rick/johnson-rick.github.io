document.addEventListener("DOMContentLoaded", function (event) {
    //localStorage.clear();
    var hasIsbns = checkForArray('isbns');
    
    var hasIsbns = checkForArray('isbns');
	var ddlIsbn = document.getElementById('ddlIsbn');
	ddlIsbn.addEventListener(
        'change',
        function ()
        {
            fadeInTextIsbn(this.value);
        },
        false
    );
	
    var ddlFragment = document.createDocumentFragment();

    if (hasIsbns == true) {
        var isbns = getItemFromStorage('isbns');
        if (isbns != null && isbns != undefined) {
			isbns.sort(sortNumber); //build in numerical order
            for (var i = 0; i < isbns.length; i++) {
                var isbn = isbns[i];
                var book = [];
                var item = getItemFromStorage(isbn);

                if (item != null && book != undefined) {
                    book.push(getItemFromStorage(isbn));
                    CreateTable(book);
                    addItemToDropdown(isbn, isbn);
                }
            }
        }
		document.getElementById('ddlIsbn').classList.remove('hide', 'inline');
		document.getElementById('ddlIsbn').classList.add('unhide', 'inline');
    }
	else
        {
			document.getElementById('ddlIsbn').classList.add('hide', 'inline');
            document.getElementById('inputIsbn').classList.remove('hide', 'inline');
            document.getElementById('inputIsbn').classList.add('unhide', 'inline');
        }
	addItemToDropdown("999999", "Add New");

    function addItemToDropdown(value, display) {
        var opt = document.createElement("option");
        opt.value = 'opt_' + value;
        opt.text = display.toString();     
        opt.id = 'opt_' + value;
		ddlIsbn.appendChild(opt);
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

    document.getElementById('btnSearch').addEventListener('click', validate, false);
    document.getElementById('btnClear').addEventListener('click', clearTable, false);
	//apply event listener to all trash icons by class 'fa-trash'
	var classname = document.getElementsByClassName("fa-trash");
	for (var i = 0; i < classname.length; i++) {
		classname[i].addEventListener(
			'click', 
			function ()
			{
				var self = this;
				removeIsbn(self);
			},
       false
    )};
	document.getElementById('ddlStyle').addEventListener(
        'change',
        function ()
        {
            changeStyle(this.value);
        },
        false
    );

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
					insertInOrder(isbn);
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
                    insertIsbn(item.identifier);
                }
                else if (item.type == "ISBN_10") {
                    isbn_10 = item.identifier;
                    insertIsbn(item.identifier);
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

	function sortNumber(a, b) {
		return a - b;
	}

	function insertInOrder(newIsbn){
		 var isbns = getItemFromStorage('isbns');
		 isbns.sort(sortNumber); //sort array numerically
		 var nextIsbn = BigInt(-1);
		 
		 //find first isbn number that exceeds new isbn
		for (var i = 0; i < isbns.length; i++) { 
			if(BigInt(isbns[i]) > BigInt(newIsbn)){
				nextIsbn = isbns[i];
			}
		}	
		
		var ddl = document.getElementById("ddlIsbn");
		ddl.classList.remove('hide');
		ddl.classList.add('unhide');
		
		var opt = document.createElement("option");
		var nodeToInsertBefore;
		if(nextIsbn == -1){
			nodeToInsertBefore = document.getElementById('opt_999999'); //insert before Add New
		}
		else {
			nodeToInsertBefore = document.getElementById('opt_' + nextIsbn);
		}
		opt.value = "opt_" + newIsbn
		opt.text = newIsbn;     
		opt.id = 'opt_' + newIsbn;
		
		//check if already exists in select (only insert if not already exists)
		if(!optionExists( 'opt_' + newIsbn, ddl)){
			ddl.insertBefore(opt, nodeToInsertBefore);
		}	 
	}

	function optionExists ( opt, sel )
	{
		var optionExists = false,
			optionsLength = sel.length;

		while ( optionsLength-- )
		{
			if ( sel.options[ optionsLength ].value === opt )
			{
				optionExists = true;
				break;
			}
		}
		return optionExists;
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
	
	function removeIsbn(ref){
		var row = ref.parentNode.parentNode.parentNode;
		var rowId = row.id;
		var isbn = rowId.substr(4);
		var rowIdx = document.getElementById(rowId).rowIndex;
		//remove child from select
		var ddl = document.getElementById('ddlIsbn');
		var opt = document.getElementById('opt_' + isbn);
		ddl.removeChild(opt);
		//make row disappear first
		hideRowBeforeDelete(rowId);
		//remove the row after it disappears
		document.getElementById('Books').deleteRow(rowIdx);
		//array isbn
		//TO DO: delete the related isbn from the isbns array in localstorage
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
                      item.author,
					  '<i class="fa fa-trash"></i>');
            dataitems.push(data);
        });

        var table = document.getElementById('Books').getElementsByTagName('tbody')[0];
        if (dataitems.length > 0)
        {
            var divTable = document.getElementById('divTable');
			divTable.classList.add('showTable');
			divTable.classList.remove('hideTable');
        }

        for (var i = 0; i < dataitems.length; i++) {
             //create a new row
            var newRow = table.insertRow(table.rows.length);
			var isbns = dataitems[i][4];
			var rowIds = isbns.split(",");
			var rowId = rowIds[0];
			newRow.id = "row_" + rowId;
			newRow.className = "customStyle"
			
            for (var j = 0; j < dataitems[i].length; j++) {
				//create a new cell
                var cell = newRow.insertCell(j);
				cell.className = 'customStyle';
                 //add value to the cell
                cell.innerHTML = '<div>' + dataitems[i][j] + '</div>';
				//center trash icon
				if(j == dataitems[i].length - 1){
					cell.className = "customStyle center";
				}
            }
        }
    }  
	
function hideRowBeforeDelete(rowId) {
	//console.log(rowId);
	var row = document.getElementById(rowId);
	//get each cell in row
	var cells = row.getElementsByTagName("td");
	
	for(var i=0;i<cells.length;i++) {
		var divs = cells[i].getElementsByTagName("div");
		for(var j=0;j<divs.length;j++) {
			divs[j].classList.add('hideCell');
		}
		cells[i].classList.add('hideCell');
	}

	//then change style.height on tr
	row.classList.add('hideRow');
	//console.log(row.classList);
}

    function validate()
    {
        var isbnNew = document.getElementById('isbn').value; //"9780439023528" test isbn;
        var isbnValidate = document.getElementById('isbnValidate');
		var isError = false;

        var isbns = getItemFromStorage('isbns');
        if (isbns != null && isbns != undefined) {
            for (var i = 0; i < isbns.length; i++) {
                var isbnExisting = isbns[i];         

                if (isbnExisting != null && isbnExisting != undefined)
                {
                    if (isbnNew.toString() == isbnExisting.toString())
                    {
                        isbnValidate.innerHTML = "The ISBN: " + isbnNew + " already exists in the results.";
                        isbnValidate.className = "visible required validationError";
						//document.getElementById('btnSearch').classList.add('shake-horizontal');
						//var t = setTimeout(function(){
						//   isbnValidate.classList.remove('validationError');
						//   document.getElementById('btnSearch').classList.remove('shake-horizontal');
						//},(3000));
                        return;
                    }
                }
            }
        }
        
        if (isbnNew == null || isbnNew == undefined || isbnNew == '') {
            var isbnValidate = document.getElementById('isbnValidate');
            isbnValidate.innerHTML = 'ISBN Number is required';
            isbnValidate.className = "visible required validationError";
			document.getElementById('btnSearch').classList.add('shake-horizontal');
			var t = setTimeout(function(){
			   isbnValidate.classList.remove('validationError');
			   document.getElementById('btnSearch').classList.remove('shake-horizontal');
			},(3000));
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
		divTable.classList.remove("showTable");
		divTable.classList.add("hideTable");
		var t = setTimeout(function(){
			   table.innerHTML = "";
			   localStorage.clear();
			   location.reload();
			},(2000));
		
        
    }

    function validateResults(count)
    {
        var isbn = document.getElementById('isbn').value;
        switch (count) {
            case 0:                
                isbnValidate.innerHTML = 'There were no results found for ISBN ' + isbn;
                isbnValidate.className = "visible required validationError";
				var t = setTimeout(function(){
					isbnValidate.classList.remove('validationError');
				},(3000));
                break;
        }
    }

    function fadeInTextIsbn(selectedValue)
    {
        if (selectedValue != null && selectedValue != undefined && selectedValue == 'opt_999999') {
            document.getElementById('inputIsbn').classList.remove('hide', 'inline');
            document.getElementById('inputIsbn').classList.add('unhide', 'inline');
			//reset any previous highlighted rows
			var rows = document.getElementsByClassName('highlightRow');
			for (var i = 0; i < rows.length; i++) {
				rows[i].classList.remove('highlightRow');
			}
        }
        else
        {
            document.getElementById('inputIsbn').classList.remove('unhide', 'inline');
            document.getElementById('inputIsbn').classList.add('hide', 'inline');
			if(selectedValue != null && selectedValue != undefined && selectedValue != -1){
				var isbn = selectedValue.substr(4);
				var row = document.getElementById('row_' + isbn);
				//first reset any previous highlighted rows
				var rows = document.getElementsByClassName('highlightRow');
				for (var i = 0; i < rows.length; i++) {
					rows[i].classList.remove('highlightRow');
				}
				
				row.classList.add('highlightRow');
			}
        }
    }

    var objSelect = document.getElementById("ddlIsbn");

    //Set selected
	if(objSelect != null){
		setSelectedValue(objSelect, "--Select--");
	}

    function setSelectedValue(selectObj, valueToSet) {
        for (var i = 0; i < selectObj.options.length; i++) {
            if (selectObj.options[i].text == valueToSet) {
                selectObj.options[i].selected = true;
                return;
            }
        }
    }
	
	function changeStyle(style){
		switch(style) {
				case 'style1':
					document.getElementById('header').style.font = "55px 'Almendra SC'";
					document.getElementById('header').style.color = "#43acb5";
					document.getElementById('header').style.textShadow = "-2px 2px 0px #00e6e6, -4px 4px 0px #01cccc, -6px 6px 0px #00bdbd";
					var rows = document.getElementsByClassName("customStyle"),
						len = rows !== null ? rows.length : 0,
						i = 0;
					for(i; i < len; i++) {
						rows[i].classList.add('style1'); 
						rows[i].classList.remove('style2'); 
					}
					break;
				case 'style2':
					var rows = document.getElementsByClassName("customStyle"),
						len = rows !== null ? rows.length : 0,
						i = 0;
					for(i; i < len; i++) {
						rows[i].classList.remove('style1'); 
						rows[i].classList.add('style2'); 
					}
					document.getElementById('header').style.font = "45px 'Bangers'";
					document.getElementById('header').style.color = "#779bcd";
					document.getElementById('header').style.textShadow = "6px 6px 0px rgba(0,0,0,0.2)";
					break;
				default:
					document.getElementById('header').style.font = '';
					document.getElementById('header').style.color = "#000000";
					document.getElementById('header').style.textShadow = '';
					var rows = document.getElementsByClassName("customStyle"),
						len = rows !== null ? rows.length : 0,
						i = 0;
					for(i; i < len; i++) {
						rows[i].classList.remove('style1'); 
						rows[i].classList.remove('style2'); 
					}
		}
	}

});

