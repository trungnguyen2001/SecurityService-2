﻿

function load_combobox_request() {
    $.ajax({
        type: "Get",
        url: 'http://localhost:44383/api/requests',
        dataType: 'json',
        contentType: "application/json, charset=utf8",
        success: function (data) {
            var select_request = "<select onchange='get_id_service(this);' id='select_request' name='select_request'><option id='Choose_Client' value='Choose_Client'>Choose Client</option>"
            $.each(data, function (i, item) {
                select_request += "<option id='" + item.id + "' address_client='" + item.client_address + "'  value='" + item.service + "'>" + item.client_name + "</option>"
            })
            select_request += "</select>"
            $('#select_request').replaceWith(select_request);
        },
        erorr: function (data) {
            alert("Erorr")
        }
    })
}


function get_id_service(a) {
    var id = a.value;
    var address_client = $(a).children(":selected").attr("address_client");
    $('#location').val(address_client);

    $.ajax({
        type: "Get",
        url: 'http://localhost:44383/api/teams_get_id_service/' + id,
        dataType: 'json',
        contentType: "application/json, charset=utf8",
        success: function (data) {
            var select_team = "<select id='select_team' name='select_team'><option id='Choose_Team' value='Choose_Team'>Choose Team</option>"
            $.each(data, function (i, item) {
                select_team += "<option id='" + item.id + "' value='" + item.id + "'>" + item.name + "</option>"
            })
            select_team += "</select>"
            $('#select_team').replaceWith(select_team);
        },
        erorr: function (data) {
            alert("Erorr")
        }
    })
}

function onclick_send_task() {
    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
        return arg !== value;
    }, "Value must not equal arg.");
    $('#form_task').validate({
        ignore: [],
        rules: {
            name_task: "required",
            star_day: "required",
            end_day: "required"
        },
        messages: {
            name_task: "Please select an item!",
            location: "Please select an item!",
            star_day: "Please select an item!",
            end_day: "Please select an item!"
        }
    });
    $('#form_task1').validate({
        ignore: [],
        rules: {
            description_task: "required",
            select_request: { valueNotEquals: "Choose_Client" },
            select_team: { valueNotEquals: "Choose_Team" }
        },
        messages: {
            select_request: { valueNotEquals: "Please select an item!" },
            select_team: { valueNotEquals: "Please select an item!" }
        }
    });
    if ($('#form_task').valid()) {
        if ($('#form_task1').valid()) {
            var infor_task = new Object();
            var name = $('#name_task').val();
            var star_day = $('#star_day').val();
            var end_day = $('#end_day').val();
            var location = $('#location').val();
            var status_task = $("#status_task").prop("checked");
            var description_task = $('#description_task').val();
            var id_request = $('#select_request option:selected').attr('id');
            var id_team = $('#select_team option:selected').attr('id');
            if (status_task == true) {
                infor_task.status = true;
            } else {
                infor_task.status = false;
            }
            infor_task.name = name;
            infor_task.task_status = "1";
            infor_task.start_day = star_day;
            infor_task.end_day = end_day;
            infor_task.location = location;
            infor_task.descripttion = description_task;
            infor_task.request = id_request;
            infor_task.team = id_team;
            var q = JSON.stringify(infor_task)
            $.ajax({
                type: 'Post',
                url: 'http://localhost:44383/api/tasks',
                data: q,
                contentType: "application/json; charset=utf8",
                dataType: 'json',
                success: function (data) {
                    alert("Success");
                    clear_form_task();
                    load_combobox_request();
                },
                error: function (data) {
                    alert(JSON.stringify(data));
                    clear_form_task();
                    load_combobox_request();
                }
            });
        }
    }
}


function clear_form_task() {
    $('#name_task').val("");
    $('#status_task').prop("checked", false);
    $('#description_task').val("");
    $("input[type=date]").val("");
    $('#location').val("");
    $('#description_task').val("");
    $('#select_request').find('option').remove();
    $('#select_team').find('option').remove();
}

function clear_label_task() {
    $('#name_task-error').css('display', 'none');
    $('#star_day-error').css('display', 'none');
    $('#end_day-error').css('display', 'none');
    $('#select_request-error').css('display', 'none');
    $('#select_team-error').css('display', 'none');
}

