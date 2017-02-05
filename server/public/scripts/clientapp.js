$(document).ready(function() {
    getData();



    //button listeners
    $('#dataForm').on("click", ".item_place", pressEnter);
    $('#submitTestData').on("click", postData);

    $('#dataTable').on("click", ".delete", deleteData);
    $('#dataTable').on("click", ".update", updateData);

    $('#btnTest').on("click", sort);

    $('#dataTable').on("click", "#itemDateHeader", sort);
    $('#dataTable').on("click", "#itemNameHeader", sort);
    $('#dataTable').on("click", "#itemAmountHeader", sort);
    $('#dataTable').on("click", "#itemPlaceHeader", sort);

});



// DELETE DATA FROM DB
function deleteData() {
    var testdataID = $(this).attr("id");

    $.ajax({
        type: 'DELETE',
        url: '/testRoute/' + testdataID,
        success: function() {
            console.log('DELETED ITEM: ID:', testdataID);

            $('#dataTable').empty();
            getData();
        },
        error: function() {
            console.log("error in delete");
        }
    });
}









//UPDATE DATA IN DB
function updateData() {
    var testdata = {};
    //goes into data table to grab all data within.
    var inputs = $(this).parent().children().serializeArray();
    $.each(inputs, function(i, field) {
        testdata[field.name] = field.value;

        //CHECK FOR INT IF INPUTING NUM:
        checkNumInField(field, "item_amount");
    });
    console.log("updateData searches through:", testdata);

    //finds updateButton's appened id refrencing rowValue.id
    var testdataID = $(this).parent().attr('id');

    $.ajax({
        type: 'PUT',
        url: '/testRoute/' + testdataID,
        data: testdata,
        success: function() {
            console.log("/PUT ran success", testdata);
            $('#dataTable').empty();
            getData();
        },
        error: function() {
            console.log("error in put");
        }
    });
}






// POST DATA TO DB
function postData() {
    event.preventDefault();

    var testdata = {};

    $.each($('#dataForm').serializeArray(), function(i, field) {
        testdata[field.name] = field.value;
        checkNumInField(field, "item_amount");
    });

    $.ajax({
        type: 'POST',
        url: '/testRoute',
        data: testdata,
        success: function() {
            console.log('/POST success function ran', testdata);
            //empty and repopulate #dataTable and input fields
            var form = document.getElementById("dataForm");
            form.reset();
            $('#dataTable').empty();
            getData();

        },
        error: function() {
            console.log('/POST didnt work');
            alert("You must fill out form completely.");

        }

    });
}







// GET DATA FROM DB, PUT ON DOM
function getData() {
    $.ajax({
        type: 'GET',
        url: '/testRoute',
        success: function(data) {
            console.log('/GET success function ran', data);
            buildTableHeader(['Item Date', 'Item Name', 'Item Amount', 'Item Place'], ['itemDateHeader', 'itemNameHeader', 'itemAmountHeader', 'itemPlaceHeader']);

            data.forEach(function(rowData, i) {
                var $el = $('<div class="itemDataRow" id="' + rowData.id + '"></div>');

                var dataTable = ['item_date', 'item_name', 'item_amount', 'item_place'];
                dataTable.forEach(function(property) {

                    var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
                    $input.val(rowData[property]);
                    $el.append($input);

                });

                $el.append('<button id=' + rowData.id + ' class="update">Update</button>');
                $el.append('<button id=' + rowData.id + ' class="delete">Delete</button>');

                $('#dataTable').append($el);
            });

            // get date format to mm/dd/yy
            var dateValues = $("#dataTable").find(".itemDataRow").find("#item_date");
            for (var i = 0; i < dateValues.length; i++) {
              var dateStr = dateValues[i].value;
              let year = dateStr.substring(2,4);
              let month = dateStr.substring(5,7);
              let day = dateStr.substring(8,10);
              newDate = month + "/" + day + "/" + year;
              dateValues[i].value = newDate;
            }
        },

        error: function(response) {
            console.log('GET /testRoute fail. No data could be retrieved!', response);
        },
    });

}





// CHECK  NUM
// Display/Quality of Life
function checkNumInField(theField, numField) {
    if (theField.name == numField) {
        // var decimal=  /[-+][0-9]+\.[0-9]+$/;
        // if(inputtxt.value.match(decimal))
        if (theField.value * 0 !== 0) {
            alert("You must input numbers in 'Amount' field");
            location.reload();
        }
    }
}




// BUILD HEADER
function buildTableHeader(headerList, id) {
    var $header = $('<div id="dataTableHead"></div>');
    headerList.forEach(function(property, i) {

        var $input = $('<input type="text" name="' + property + '" id="' + id[i] + '" readonly />');
        $input.val(property);
        $header.append($input);
        $('#dataTable').append($header);
    });
}




// SUBMIT ON HITTING ENTER KEY
function pressEnter(pressEnterOn) {
    $('pressEnterOn').keypress(function(e) {
        if (e.which == 13) {
            postData();
        }
    });
}

function sort(e) {
    event.preventDefault();
    console.log("alive", e.target);
    var nameToSort = $("#dataTable").find(".itemDataRow").find("#item_name");
    // var test = $("#item_name");
    // console.log("test",test);
    // console.log(nameToSort);
    nameArray = [];

    for (var i = 0; i < nameToSort.length; i++) {
      // console.log(nameToSort[i].value);
      sortedName = nameToSort[i].value;
      nameArray.push(sortedName);
    }
    console.log(nameArray);
    console.log(nameArray.sort());
    sortedNameArray = nameArray.sort();
    $("#dataTable").find(".itemDataRow").html(sortedNameArray);
}
