document.addEventListener("DOMContentLoaded", loadTable);

function loadTable() {
    $.ajax({
        type: 'GET',
        url: "http://flip3.engr.oregonstate.edu:9900/get-workouts",
        success: function (workouts) {
            drawRows(workouts);
        }
    })

}

 $(document).ready(function() {
      if (window.location.pathname == '/edit-row') {
        var id = Number(window.location.search.substring(4, window.location.search.length));
        $.ajax({
            type: 'GET',
            url: "http://flip3.engr.oregonstate.edu:9900/get-a-workout?id=" + id,
            success: function (data) {
                var rowData = JSON.parse(data)[0];
                document.getElementById("name").value = rowData.name;
                document.getElementById("weight").value = rowData.weight;
                document.getElementById("lbs").value = rowData.lbs;
                document.getElementById("reps").value = rowData.reps;
                document.getElementById("date").value = rowData.date;
                document.getElementsByTagName("div").id = id;
            }
        })
    }
 })


function drawRows(workouts) {
    var obj = JSON.parse(workouts.results);
    if (workouts != 0)
    {
        for (var i = 0; i < obj.length; i++){
        var row = $("<tr id=" + obj[i].id + "/>");
        $("#table").append(row);
        row.append($("<td>" + obj[i].name + "</td>"));
        row.append($("<td>" + obj[i].weight + "</td>"));
        row.append($("<td>" + obj[i].lbs + "</td>"));
        row.append($("<td>" + obj[i].reps + "</td>"));
        row.append($("<td>" + obj[i].date + "</td>"));
        row.append($('<td><input type="submit" value="Edit" onclick="edit(' + obj[i].id + ')"/>' +
        '<input type="submit" value="Delete" onclick="deleteRow(' + obj[i].id + ')"/></td>'));
        }
    }

}

function submit () {
    var name = $('#name').val();
    var weight = $('#weight').val();
    var weightUnit = $('#weightUnit').val();
    var reps = $('#reps').val();
    var date = $('#date').val();
    var data = { id: null, name: name, weight: weight, weightUnit: weightUnit, reps: reps, date: date };
    $.ajax({
        type: 'GET',
        url: "http://flip3.engr.oregonstate.edu:9900/submit?name=" + name + "&weight=" + weight + "&weightUnit=" + weightUnit + "&reps=" + reps + "&date=" + date,
        success: function (id) {
            data.id = id;
            drawRow(data);
        }
    })
}

function drawRow(rowData) {
    var row = $("<tr id=" + rowData.id + "/>");
    $("#table").append(row);
    row.append($("<td>" + rowData.name + "</td>"));
    row.append($("<td>" + rowData.weight + "</td>"));
    row.append($("<td>" + rowData.weightUnit + "</td>"));
    row.append($("<td>" + rowData.reps + "</td>"));
    row.append($("<td>" + rowData.date + "</td>"));
    row.append($('<td><input type="submit" value="Edit" onclick="edit(' + rowData.id + ')"/>' +
        '<input type="submit" value="Delete" onclick="deleteRow(' + rowData.id + ')"/></td>'));
}

function save() {
    var name = $('#name').val();
    var weight = $('#weight').val();
    var lbs = $('#lbs').val();
    var reps = $('#reps').val();
    var date = $('#date').val();
    var id = document.getElementsByTagName('div').id;
    $.ajax({
        type: 'GET',
        url: "http://flip3.engr.oregonstate.edu:9900/edit-save?id=" + id + "&name=" + name + "&weight=" + weight + "&lbs=" + lbs + "&reps=" + reps + "&date=" + date,
        success: function () {
            window.location = "http://flip3.engr.oregonstate.edu:9900/";
        }
    });
}

function edit(id) {
    $.ajax({
        type: 'GET',
        url: "http://flip3.engr.oregonstate.edu:9900/get-a-workout?id=" + id,
        success: function (data) {
            var rowData = JSON.parse(data)[0];            
            window.location = "http://flip3.engr.oregonstate.edu:9900/edit-row?id=" + rowData.id;
            
        }
    })
}

function deleteRow(id) {
    $.ajax({
        type: 'GET',
        url: "http://flip3.engr.oregonstate.edu:9900/delete?id=" + id,
        success: function () {
            $("#" + id).remove();
        }
    });
}