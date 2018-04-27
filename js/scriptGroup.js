$(document).ready(function () {
    $.ajaxSetup({
        cache: false
    });
    var showCreateGroupForm = $('#showCreateGroupForm');
    var formCreateGroup = $('#formCreateGroup');
    var showReadGroupOutput = $('#showReadGroupOutput');
    var outputGroup = $('#outputGroup');
    var showDeleteGroupForm = $('#showDeleteGroupForm');
    var formDeleteGroup = $('#formDeleteGroup');
    var showUpdateGroupForm = $('#showUpdateGroupForm');
    var formUpdateGroup = $('#formUpdateGroup');
    var createGroup = $('#createGroup');
    var updateGroup = $('#updateGroup');
    var userListForm = $('#userListForm');

    var numberOfItems = 0;


    //CREATE

    showCreateGroupForm.click(function () {
        formCreateGroup.toggleClass('hidden');
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/users',
            success: function (data, status, xhr) {
                var html = '<table>';
                $(data).each(function (i) {

                    html +=
                        '<tr><td><i>userName: </i>' + this.userName + '</td><td><input type="checkbox" id="checkboxUser' + i + '"><input type="hidden" id="inputUser' + i + '" value="' + this.userId + '"></td></tr>';
                    numberOfItems = i;
                });
                html += '</table>';
                userListForm.html(html);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });
    });


    createGroup.click(function () {
        //validateCreateUserFields(); 
        var userList = [];
        for (let i = 0; i <= numberOfItems; i++) {
            var checkboxId = '#checkboxUser' + i;
            var inputId = '#inputUser' + i;
            if ($(checkboxId).is(":checked")) {
                userList.push($(inputId).val());
            }
        }
        var data = JSON.stringify({
            groupName: $('#groupName').val(),
            list: userList
        });
        var userId;
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/api/groups',
            data: data,
            contentType: "application/json",
            success: function (data, status, xhr) {
                console.log('Status: ' + status);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });
        formCreateGroup.toggleClass('hidden');
    });


    //READ

    showReadGroupOutput.click(function () {
        var data = {};
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/groups',
            success: function (data, status, xhr) {
                console.log('Status: ' + status);
                var html = "";
                var prevName = "";
                $(data).each(function () {
                    if (prevName != this.groupName) {
                        html +=
                            '</p><br/><p><i>groupName: </i>' + this.groupName + '</p>' +
                            '<p><i>userNames: </i>';
                        if (this.userName != null) {
                            html += this.userName + ' ';
                        }
                        prevName = this.groupName;
                    } else {
                        if (this.userName != null) {
                            html += this.userName + ' ';
                        }
                    }
                });
                html += '</p>';
                outputGroup.html(html);
                outputGroup.toggleClass('hidden');
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });

    });

    //Update

    showUpdateGroupForm.click(function () {
        formUpdateGroup.toggleClass('hidden');
        var data = {};
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/groups',
            success: function (data, status, xhr) {
                var html = '<table>';
                var prev = ""
                $(data).each(function (i) {
                    if (prev != this.groupName) {
                        html +=
                            '<tr><td><i>userName: </i>' + this.groupName + '</td><td><input name="updateRadio" type="radio" id="radioUG' + i + '"><input type="hidden" id="inputUG' + i + '" value="' + this.groupId + '"></td></tr>';
                        numberOfItems = i;
                    }
                    prev=this.groupName;
                });
                html += '</table><br><button id="showGroupDataToUpdate" class="btn btn-info btn-large btn-light submitButton">Update</button>';
                formUpdateGroup.html(html);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });

    });

    formUpdateGroup.on('click', '#showGroupDataToUpdate', function () {
        for (let i = 0; i <= numberOfItems; i++) {
            var radioId = '#radioUG' + i;
            var inputIdU = '#inputUG' + i;
            var html = "";
            if ($(radioId).is(":checked")) {
                var url = 'http://localhost:8000/api/groups/' + $(inputIdU).val()
                $.ajax({
                    type: 'GET',
                    url: url,
                    success: function (data, status, xhr) {
                        console.log("ss");
                        html += '<table><tr>' +
                            '<td><label for="userNameUG">userName</label></td>' +
                            '<td><input type="text" name="userNameUG" id="userNameUG" value="' + data[0].groupName + '"></td></tr></table><button id="updateUser" class="btn btn-info btn-large btn-light submitButton">Update</button><input id="groupToUpdate" type="hidden" value="' + data[0].groupId + '"></td></tr>';

                        $.ajax({
                            type: 'GET',
                            url: 'http://localhost:8000/api/users',
                            success: function (data, status, xhr) {
                                var prevUserName = "";
                                $(data).each(function (i) {
                                    if (prevUserName != this.userName) {
                                        html +=
                                            '<tr><td><i>UserName: </i>' + this.userName + '</td><td><input type="checkbox" id="checkboxGU' + i + '"><input type="hidden" id="inputGU' + i + '" value="' + this.userId + '"></td></tr>';
                                        numberOfItems = i;
                                        prevUserName = this.userName;
                                    }
                                });
                                html += '</table>';

                                formUpdateGroup.html(html);
                            },
                            error: function (xhr, status, error) {
                                alert('Error occured: ' + status);
                            }
                        });
                    },
                    error: function (xhr, status, error) {
                        alert('Error occured: ' + status);
                    }
                });

            }
        }

    });

    formUpdateGroup.on('click', '#updateUser', function () {
        var userList = [];
        for (let i = 0; i <= numberOfItems; i++) {
            var checkboxId = '#checkboxGU' + i;
            var inputId = '#inputGU' + i;
            if ($(checkboxId).is(":checked")) {
                userList.push($(inputId).val());
                
                console.log(userList);
            }
        }
        var inputId = $('#groupToUpdate').val();
        var data = JSON.stringify({
            groupName: $('#groupName').val(),
            list: userList
        });
        var url = 'http://localhost:8000/api/groups/' + inputId;
        console.log(data);
        console.log(url);
        $.ajax({
            type: 'PUT',
            url: url,
            data: data,
            contentType: "application/json",
            success: function (data, status, xhr) {
                console.log('Status: ' + status);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });
        formUpdateGroup.toggleClass('hidden');
    });

    //DELETE

    showDeleteGroupForm.click(function () {
        formDeleteGroup.toggleClass('hidden');
        var data = {};
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/groups',
            success: function (data, status, xhr) {
                var html = '<table>';
                var prevName = "";
                $(data).each(function (i) {
                    if (prevName != this.groupName) {
                        html +=
                            '<tr><td><i>groupName: </i>' + this.groupName + '</td><td><input type="checkbox" id="checkboxDG' + i + '"><input type="hidden" id="inputDG' + i + '" value="' + this.groupId + '"></td></tr>';
                        numberOfItems = i;
                    }
                    prevName = this.groupName;
                });
                html += '</table><br><button id="deleteGroup" class="btn btn-info btn-large btn-light submitButton">Delete</button>';
                formDeleteGroup.html(html);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });

    });

    formDeleteGroup.on('click', '#deleteGroup', function () {
        for (let i = 0; i <= numberOfItems; i++) {
            var checkboxId = '#checkboxDG' + i;
            var inputId = '#inputDG' + i;
            if ($(checkboxId).is(":checked")) {
                var url = 'http://localhost:8000/api/groups/' + $(inputId).val();
                $.ajax({
                    type: 'DELETE',
                    url: url,
                    success: function (data, status, xhr) {
                        console.log('Status: ' + status);
                    },
                    error: function (xhr, status, error) {
                        alert('Error occured: ' + status);
                    }
                });
            }
        }

        formDeleteGroup.toggleClass('hidden');
    });
});
