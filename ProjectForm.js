$("#Id").focus();

function validateAndGetFormData() {

    var projectIdVar = $("#Id").val();
    if (projectIdVar === "") {
        $("#Id").focus();
        return "";
    }

    var nameVar = $("#name").val();
    if (nameVar === "") {
        $("#name").focus();
        return "";
    }

    var assignedToVar = $("#assigned").val();
    if (assignedToVar === "") {
        $("#assigned").focus();
        return "";
    }

    var assignmentDateVar = $("#assigned_date").val();
    if (assignmentDateVar === "") {
        $("#assigned_date").focus();
        return "";
    }

    var deadlineVar = $("#deadline").val();
    if (deadlineVar === "") {
        $("#deadline").focus();
        return "";
    }

    var jsonStrObj = {
        projectId: projectIdVar,
        projectName: nameVar,
        assignedTo: assignedToVar,
        assignmentDate: assignmentDateVar,
        deadline: deadlineVar
    };

    return JSON.stringify(jsonStrObj);
}

function createRequest(connToken, jsonObj, dbName, relName, type) {
    var request = "{\n" +
        "\"token\" : \"" + connToken + "\",\n" +
        "\"cmd\" : \"SET\"," + "\n" +
        "\"dbName\": \"" + dbName + "\",\n" +
        "\"rel\" : \"" + relName + "\",\n" +
        "\"type\" : \"" + type + "\",\n" +
        "\"primaryKey\" : \"projectId\"," + "\n" +
        "\"jsonStr\": " + jsonObj + "\n" +
        "}";
    return request;
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = createRequest(connToken, jsonObj, dbName, relName, "PUT");
    return putRequest;
}

function createUpdateRequest(connToken, jsonObj, dbName, relName) {
    var updateRequest = createRequest(connToken, jsonObj, dbName, relName, "UPDATE");
    return updateRequest;
}

function displayMessage(message) {
    var error = document.getElementById("message")
        error.textContent = message;
        error.style.color = "red";
}

function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function resetForm() {
    $("#Id").val("")
    $("#name").val("");
    $("#assigned").val("");
    $("#assigned_date").val("");
    $("#deadline").val("");
    $("#Id").focus();
    document.getElementById("save").disabled = false;
    document.getElementById("update").disabled = false;
    document.getElementById("save").style.backgroundColor ="#3498db";
    document.getElementById("update").style.backgroundColor ="#3498db";
    displayMessage("");
}

function saveProject() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest("90932712|-31949276557739027|90954648", jsonStr, "PROJECT-TABLE", "COLLAGE-DB");
    jQuery.ajaxSetup({
        async: false
    });
    var resultObj = executeCommand(putReqStr, "http://api.login2explore.com:5577", "/api/iml/set");
    alert("Data Entered Sucessfully.");
    jQuery.ajaxSetup({
        async: true
    });
    resetForm();
}

function updateProject() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    var updateReqStr = createUpdateRequest("90932712|-31949276557739027|90954648", jsonStr, "PROJECT-TABLE", "COLLAGE-DB");
    alert("Project Record Updated");
    jQuery.ajaxSetup({
        async: false
    });
    var resultObj = executeCommand(updateReqStr, "http://api.login2explore.com:5577", "/api/iml/set");
    jQuery.ajaxSetup({
        async: true
    });
    resetForm();
}

function getRecord() {
    var primaryKey =  $("#Id").val();
    var getReqStr = "{\n" +
                    "\"token\" : \"" + "90932712|-31949276557739027|90954648" + "\",\n" +
                    "\"cmd\" : \"GET_BY_KEY\"," + "\n" +
                    "\"dbName\": \"" + "PROJECT-TABLE" + "\",\n" +
                    "\"rel\" : \"" + "COLLAGE-DB" + "\",\n" +
                    "\"jsonStr\": {\n" + "\"projectId\" : \""+ primaryKey +"\"\n}" + "\n" +
                    "}";
    jQuery.ajaxSetup({
        async: false
    });
    var resultObj = executeCommand(getReqStr, "http://api.login2explore.com:5577", "/api/irl");
    var resultString = JSON.stringify(resultObj);
    console.log(resultString);
    return resultObj;
}

function checkPrimaryKey(){
    var jsonStr = getRecord();
    if(jsonStr.data=="" || jsonStr.status=="400"){
        document.getElementById("update").disabled = true;
        document.getElementById("save").disabled = false;
        document.getElementById("update").style.backgroundColor ="#808080";
        document.getElementById("save").style.backgroundColor ="#3498db";
        $("#name").val("");
        $("#assigned").val("");
        $("#assigned_date").val("");
        $("#deadline").val("");
        $("#name").focus();
        displayMessage("");
    }
    else{
        document.getElementById("save").disabled = true;
        document.getElementById("update").disabled = false;
        document.getElementById("save").style.backgroundColor ="#808080";
        document.getElementById("update").style.backgroundColor ="#3498db";
        dataObj = JSON.parse(jsonStr.data);
        $("#name").val(dataObj.record.projectName);
        $("#assigned").val(dataObj.record.assignedTo);
        $("#assigned_date").val(dataObj.record.assignmentDate);
        $("#deadline").val(dataObj.record.deadline);
        $("#name").focus();
        displayMessage("Record with entered primary key is already in database,You can change the existing record or change the primary key for saving new record");
    }
}

