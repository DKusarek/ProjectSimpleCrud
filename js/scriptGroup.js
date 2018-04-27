$(document).ready(function () {
    var showCreateGroupForm = $('#showCreateGroupForm');
    var formCreateGroup = $('#formCreateGroup');
    var showReadGroupOutput = $('#showReadGroupOutput');
    var outputGroup = $('#outputGroup');
    var showDeleteGroupForm = $('#showDeleteGroupForm');
    var formDeleteGroup = $('#formDeleteGroup');
    var showUpdateGroup = $('#showUpdateGroup');
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
                        '<tr><td><i>userName: </i>' + this.userName + '</td><td><input type="checkbox" id="checkboxUser' + i + '"><input type="hidden" id="inputUser' + i + '" value="' + this._id + '"></td></tr>';
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
        var userListString = [];
        var userList = [];
        for (let i = 0; i <= numberOfItems; i++) {
            var checkboxId = '#checkboxUser' + i;
            var inputId = '#inputUser' + i;
            if ($(checkboxId).is(":checked")) {
                userList.push($(inputId).val());
                userListString.push(String($(inputId).val()));
            }
        }
        console.log(userListString);
        var data = JSON.stringify({
            groupName: $('#groupName').val(),
            usersList: userListString
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
        var userList;
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/groups',
            success: function (data, status, xhr) {
                console.log('Status: ' + status);
                var html = "";
                var html2 = "";
                $(data).each(function () {

                    html += '<p><b><i>groupName: </i>' + this.groupName + '</b></p><p>Users: </p>';
                    userList = this.usersList;
                    console.log(userList);

                    userList.forEach(function (item) {
                        console.log('http://localhost:8000/api/users/' + item)
                        $.ajax({
                            type: 'GET',
                            async: false,
                            url: 'http://localhost:8000/api/users/' + item,
                            success: function (data, status, xhr) {
                                html2 += data.userName + '<br/>';
                                console.log(html2);
                            },
                            error: function (xhr, status, error) {
                                alert('Error occured: ' + status);
                            }
                        });
                    });

                });
                html += html2;
                console.log(html);
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
                $(data).each(function (i) {

                    html +=
                        '<tr><td><i>userName: </i>' + this.userName + '</td><td><input name="updateRadio" type="radio" id="radio' + i + '"><input type="hidden" id="inputU' + i + '" value="' + this._id + '"></td></tr>';
                    numberOfItems = i;
                });
                html += '</table><br><button id="showUserDataToUpdate" class="btn btn-info btn-large btn-light submitButton">Update</button>';
                formUpdateGroup.html(html);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });

    });

    formUpdateGroup.on('click', '#showUserDataToUpdate', function () {
        for (let i = 0; i <= numberOfItems; i++) {
            var radioId = '#radio' + i;
            var inputIdU = '#inputU' + i;
            var html = "";
            if ($(radioId).is(":checked")) {
                console.log(radioId);
                var url = 'http://localhost:8000/api/groups/' + $(inputIdU).val()
                $.ajax({
                    type: 'GET',
                    url: url,
                    success: function (data, status, xhr) {
                        console.log("ss");
                        html += '<table><tr>' +
                            '<td><label for="userNameU">userName</label></td>' +
                            '<td><input type="text" name="userNameU" id="userNameU" value="' + data.userName + '"></td>' +
                            '</tr><tr><td><label for="passwordU">Password</label></td>' +
                            '<td><input type="password" name="passwordU" id="passwordU" value="' + data.password + '"></td>' +
                            '</tr><tr><td><label for="firstNameU">firstName</label></td>' +
                            '<td><input type="text" name="firstNameU" id="firstNameU" value="' + data.firstName + '"></td>' +
                            '</tr><tr><td><label for="lastNameU">lastName</label></td><td>' +
                            '<input type="text" name="lastNameU" id="lastNameU" value="' + data.lastName + '"></td></tr>' +
                            '<tr><td> <label for="dateOfBirthU">dateOfBirth</label></td><td> ' +
                            '<input type="date" name="dateOfBirthU" id="dateOfBirthU" value="' + data.dateOfBirth + '"></td></tr></table><button id="updateUser" class="btn btn-info btn-large btn-light submitButton">Update</button><input id="userToUpdate" type="hidden" value="' + data._id + '">';

                        formUpdateGroup.html(html);
                    },
                    error: function (xhr, status, error) {
                        alert('Error occured: ' + status);
                    }
                });

            }
        }

    });

    formUpdateGroup.on('click', '#updateUser', function () {
        var inputId = $('#userToUpdate').val();
        var data = JSON.stringify({
            userName: $('#userNameU').val(),
            password: $('#passwordU').val(),
            firstName: $('#firstNameU').val(),
            lastName: $('#lastNameU').val(),
            dateOfBirth: $('#dateOfBirthU').val()
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
                $(data).each(function (i) {

                    html +=
                        '<tr><td><i>userName: </i>' + this.userName + '</td><td><input type="checkbox" id="checkbox' + i + '"><input type="hidden" id="input' + i + '" value="' + this._id + '"></td></tr>';
                    numberOfItems = i;
                });
                html += '</table><br><button id="deleteUser" class="btn btn-info btn-large btn-light submitButton">Delete</button>';
                formDeleteGroup.html(html);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });

    });

    formDeleteGroup.on('click', '#deleteUser', function () {
        for (let i = 0; i <= numberOfItems; i++) {
            var checkboxId = '#checkbox' + i;
            var inputId = '#input' + i;
            if ($(checkboxId).is(":checked")) {
                var url = 'http://localhost:8000/api/groups /' + $(inputId).val();
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
