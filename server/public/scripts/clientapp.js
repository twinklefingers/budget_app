$(document).ready(function() {
    getData();

    $('#item_place').keypress(function(e) {
        if(e.which == 13) {
            postData();
        }
    });

    //button listeners
    $('#submitTestData').on("click", postData);
    $('#dataTable').on("click", ".delete", deleteData);
    $('#dataTable').on("click", ".update", updateData);
});




// DELETE DATA
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









//UPDATE DATA
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






// POST DATA
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







// GET DATA
function getData() {
    $.ajax({
        type: 'GET',
        url: '/testRoute',
        success: function(data) {
            console.log('/GET success function ran', data);
            buildTableHeader(['Item Date', 'Item Name', 'Item Amount', 'Item Place']);

            data.forEach(function(rowData, i) {
                var $el = $('<div id="' + rowData.id + '"></div>');

                var dataTable = ['item_date', 'item_name', 'item_amount', 'item_place'];
                dataTable.forEach(function(property) {

                    var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
                    $input.val(rowData[property]);
                    $el.append($input);

                });

                $el.append('<button id=' + rowData.id + ' class="update">Update</button>');
                $el.append('<button id=' + rowData.id + ' class="delete">Delete</button>');
                // $el.append('<button id=' + rowData.id + ' class="checkInOut">Check In</button>');

                $('#dataTable').append($el);
            });
        },

        error: function(response) {
            console.log('GET /testRoute fail. No data could be retrieved!');
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
function buildTableHeader(headerList) {
    var $header = $('<div id="dataTableHead"></div>');
    headerList.forEach(function(property) {

        var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
        $input.val(property);
        $header.append($input);
        $('#dataTable').append($header);
    });
}
