$(document).ready(function() {
    getData();
    getBudgetData();


    //button listeners
    $('#dataForm').on("click", ".food_place", pressEnter);
    $('#submitTestData').on("click", postData);
    $('#submitIncome').on("click", postIncomeData);
    $('#submitExpense').on("click", postExpenseData);

    $('#dataTable').on("click", ".delete", deleteData);
    $('#dataTable').on("click", ".update", updateData);
    $('#dataTableBudget').on("click", ".deleteBudget", deleteBudgetData);
    $('#dataTableBudget').on("click", ".updateBudget", updateBudgetData);

    // Test Button - Temporary
    $('#btnTest').on("click", sort);

    // Food Menu Nav
    $('#foodCategoryBreakfast').on("click", sort);
    $('#foodCategoryLight').on("click", sort);
    $('#foodCategoryHeavy').on("click", sort);
    $('#foodCategorySide').on("click", sort);
    $('#foodCategoryDessert').on("click", sort);
    $('#foodCategoryRestaurant').on("click", sort);

    // sort nav
    $('#dataTable').on("click", "#itemDateHeader", sort);
    $('#dataTable').on("click", "#itemNameHeader", sort);
    $('#dataTable').on("click", "#itemAmountHeader", sort);
    $('#dataTable').on("click", "#itemPlaceHeader", sort);

});




////////////////////////////////////////////////////////////////////////////
////////                                                            ////////
////////                      BUDGET FUNCTIONS                      ////////
////////                                                            ////////
////////////////////////////////////////////////////////////////////////////

// DELETE DATA FROM DB budgetbase
function deleteBudgetData() {
  var testdata = {};
  //goes into data table to grab all data within.
  var inputs = $(this).parent().children().serializeArray();
  $.each(inputs, function(i, field) {
      testdata[field.name] = field.value;
  });

    var testdataID = $(this).attr("id");
    var c = confirm("Are you sure you want to delete this?\n\n" + testdata.budget_name);
    if (c == true) {
    $.ajax({
        type: 'DELETE',
        url: '/budgetRoute/' + testdataID,
        data: testdata,
        success: function() {
            console.log('DELETED ITEM: ID:', testdataID);
            $('#dataTableBudget').empty();
            getBudgetData();
        },
        error: function() {
            console.log("error in delete", error);
        }
    });
  }
}









//UPDATE DATA IN DB budgetbase
function updateBudgetData() {
    var testdata = {};
    //goes into data table to grab all data within.
    var inputs = $(this).parent().children().serializeArray();
    $.each(inputs, function(i, field) {
        testdata[field.name] = field.value;

        //CHECK FOR INT IF INPUTING NUM:
        checkNumInField(field, "budget_expense");
        checkNumInField(field, "budget_income");
    });
    console.log("updateData searches through:", testdata);

    //finds updateButton's appened id refrencing rowValue.id
    var testdataID = $(this).parent().attr('id');
    var c = confirm("Are you sure you want to update this?\n\n" + testdata.budget_name);
    if (c == true) {
    $.ajax({
        type: 'PUT',
        url: '/budgetRoute/' + testdataID,
        data: testdata,
        success: function() {
            console.log("/PUT ran success", testdata);
            $('#dataTableBudget').empty();
            getBudgetData();
        },
        error: function() {
            console.log("error in put", error);
        }
    });
  }
}






// POST DATA TO DB budgetbase
function postIncomeData() {
    event.preventDefault();
    var testdata = {};
    $.each($('#dataFormBudget').serializeArray(), function(i, field) {
        testdata[field.name] = field.value;
        checkNumInField(field, "budget_income");
    });

    $.ajax({
        type: 'POST',
        url: '/budgetRoute',
        data: testdata,
        success: function() {
            console.log('/POST INCOME success function ran', testdata);
            //empty and repopulate #dataTableBudget and input fields
            var form = document.getElementById("dataFormBudget");
            form.reset();
            $('#dataTableBudget').empty();
            getBudgetData();

        },
        error: function() {
            console.log('/POST INCOME didnt work');
            alert("You must fill out form completely.");
        }
    });
}




// POST DATA TO DB budgetbase
function postExpenseData() {
    event.preventDefault();
    var testdata = {};
    $.each($('#dataFormExpenses').serializeArray(), function(i, field) {
        testdata[field.name] = field.value;
        checkNumInField(field, "budget_expense");
    });

    $.ajax({
        type: 'POST',
        url: '/budgetRoute',
        data: testdata,
        success: function() {
            console.log('/POST EXPENSES success function ran', testdata);
            // //empty and repopulate #dataTableBudget and input fields
            // var form = document.getElementById("dataFormExpenses");
            // form.reset();
            $('#dataTableBudget').empty();
            getBudgetData();

        },
        error: function() {
            console.log('/POST EXPENSES didnt work');
            alert("You must fill out form completely.");
        }
    });
}






// GET DATA FROM DB budgetbase, PUT ON DOM
function getBudgetData() {
    $.ajax({
        type: 'GET',
        url: '/budgetRoute',
        success: function(data) {
            console.log('/GET success function ran', data);
            buildTableHeaderBudget(['Item Date', 'Item Name', 'Expense', 'Income'], ['itemDateHeaderBudget', 'itemNameHeaderBudget', 'itemAmountHeaderBudget', 'itemPlaceHeaderBudget']);

            data.forEach(function(rowData, i) {
                var $el = $('<div class="itemDataRow" id="' + rowData.id + '"></div>');

                var dataTableBudget = ['budget_date', 'budget_name', 'budget_expense', 'budget_income'];
                dataTableBudget.forEach(function(property) {
                    var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
                    $input.val(rowData[property]);
                    $el.append($input);

                });

                $el.append('<button id=' + rowData.id + ' class="btn updateBudget">Update</button>');
                $el.append('<button id=' + rowData.id + ' class="btn deleteBudget">Delete</button>');

                $('#dataTableBudget').append($el);
            });

            // get date format to mm/dd/yy
            var dateValues = $("#dataTableBudget").find(".itemDataRow").find("#budget_date");
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




////////////////////////////////////////////////////////////////////////////
////////                                                            ////////
////////                      FOOD FUNCTIONS                        ////////
////////                                                            ////////
////////////////////////////////////////////////////////////////////////////

// DELETE DATA FROM DB foodbase
function deleteData() {
  var testdata = {};
  //goes into data table to grab all data within.
  var inputs = $(this).parent().children().serializeArray();
  $.each(inputs, function(i, field) {
      testdata[field.name] = field.value;
  });

    var testdataID = $(this).attr("id");
    var c = confirm("Are you sure you want to delete this?\n\n" + testdata.food_name);
    if (c == true) {
    $.ajax({
        type: 'DELETE',
        url: '/foodRoute/' + testdataID,
        data: testdata,
        success: function() {
            console.log('DELETED ITEM: ID:', testdataID);
            $('#dataTable').empty();
            getData();
        },
        error: function() {
            console.log("error in delete", error);
        }
    });
  }
}









//UPDATE DATA IN DB FOODBASE
function updateData() {
    var testdata = {};
    //goes into data table to grab all data within.
    var inputs = $(this).parent().children().serializeArray();
    $.each(inputs, function(i, field) {
        testdata[field.name] = field.value;

        //CHECK FOR INT IF INPUTING NUM:
        checkNumInField(field, "food_amount");
    });
    console.log("updateData searches through:", testdata);

    //finds updateButton's appened id refrencing rowValue.id
    var testdataID = $(this).parent().attr('id');
    var c = confirm("Are you sure you want to update this?\n\n" + testdata.food_name);
    if (c == true) {
    $.ajax({
        type: 'PUT',
        url: '/foodRoute/' + testdataID,
        data: testdata,
        success: function() {
            console.log("/PUT ran success", testdata);
            $('#dataTable').empty();
            getData();
        },
        error: function() {
            console.log("error in put", error);
        }
    });
  }
}






// POST DATA TO DB foodbase
function postData() {
    event.preventDefault();
    var testdata = {};
    $.each($('#dataForm').serializeArray(), function(i, field) {
        testdata[field.name] = field.value;
        checkNumInField(field, "item_amount");
    });

    $.ajax({
        type: 'POST',
        url: '/foodRoute',
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







// GET DATA FROM DB foodbase, PUT ON DOM
function getData() {
    $.ajax({
        type: 'GET',
        url: '/foodRoute',
        success: function(data) {
            console.log('/GET success function ran', data);
            buildTableHeader(['Item Date', 'Item Name', 'Item Amount', 'Item Place'], ['itemDateHeader', 'itemNameHeader', 'itemAmountHeader', 'itemPlaceHeader']);

            data.forEach(function(rowData, i) {
                var $el = $('<div class="itemDataRow" id="' + rowData.id + '"></div>');

                var dataTable = ['food_date', 'food_name', 'food_amount', 'food_place'];
                dataTable.forEach(function(property) {
                    var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
                    $input.val(rowData[property]);
                    $el.append($input);

                });

                $el.append('<button id=' + rowData.id + ' class="btn update">Update</button>');
                $el.append('<button id=' + rowData.id + ' class="btn delete">Delete</button>');

                $('#dataTable').append($el);
            });

            // get date format to mm/dd/yy
            var dateValues = $("#dataTable").find(".itemDataRow").find("#food_date");
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
function checkNumInField(theField, numField) {
    if (theField.name == numField) {
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

// BUILD HEADER
function buildTableHeaderBudget(headerList, id) {
  var $headerBudget = $('<div id="dataTableHeadBudget"></div>');
    headerList.forEach(function(property, i) {
        var $input = $('<input type="text" name="' + property + '" id="' + id[i] + '" readonly />');
        $input.val(property);
        $headerBudget.append($input);
        $('#dataTableBudget').append($headerBudget);
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
