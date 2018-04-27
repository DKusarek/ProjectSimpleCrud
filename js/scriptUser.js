$(document).ready(function () {
    var showCreateUserForm = $('#showCreateUserForm');
    var formCreateUser = $('#formCreateUser');
    var showReadUserOutput = $('#showReadUserOutput');
    var outputUser = $('#outputUser');
    var showDeleteUserForm = $('#showDeleteUserForm');
    var formDeleteUser = $('#formDeleteUser');
    var showUpdateUserForm = $('#showUpdateUserForm');
    var formUpdateUser = $('#formUpdateUser');
    var createUser = $('#createUser');
    var updateUser = $('#updateUser');
    var groupListForm = $('#groupListForm');
    var numberOfItems = 0;


    //CREATE

    showCreateUserForm.click(function () {
        formCreateUser.toggleClass('hidden');
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/groups',
            success: function (data, status, xhr) {
                var html = '<table>';
                var prevGroupName = "";
                $(data).each(function (i) {
                    if (prevGroupName != this.groupName) {
                        html +=
                            '<tr><td><i>GroupName: </i>' + this.groupName + '</td><td><input type="checkbox" id="checkboxG' + i + '"><input type="hidden" id="inputG' + i + '" value="' + this.groupId + '"></td></tr>';
                        numberOfItems = i;
                        prevGroupName = this.groupName;
                    }
                });
                html += '</table>';
                groupListForm.html(html);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });
    });


    createUser.click(function () {
        //validateCreateUserFields(); 
        var groupList = [];
        for (let i = 0; i <= numberOfItems; i++) {
            var checkboxId = '#checkboxG' + i;
            var inputId = '#inputG' + i;
            if ($(checkboxId).is(":checked")) {
                groupList.push($(inputId).val());
            }
        }
        var data = JSON.stringify({
            userName: $('#userName').val(),
            password: $('#password').val(),
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            dateOfBirth: $('#dateOfBirth').val(),
            list: groupList
        });
        console.log(data);
        var userId;
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/api/users',
            data: data,
            contentType: "application/json",
            success: function (data, status, xhr) {
                console.log('Status: ' + status);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });


        formCreateUser.toggleClass('hidden');
    });


    //READ

    showReadUserOutput.click(function () {
        var data = {};
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/users',
            success: function (data, status, xhr) {
                console.log('Status: ' + status);
                var html = "";
                var prevName = "";
                $(data).each(function () {
                    if (prevName != this.userName) {
                        html +=
                            '</p><br/><p><i>userName: </i>' + this.userName + '</p>' +
                            '<p><i>password: </i>' + this.password + '</p>' +
                            '<p><i>firstName: </i>' + this.firstName + '</p>' +
                            '<p><i>lastName: </i>' + this.lastName + '</p>' +
                            '<p><i>dateOfBirth: </i>' + this.dateOfBirth + '</p>' +
                            '<p><i>groupNames: </i>';
                        if (this.groupName != null) {
                            html += this.groupName + ' ';
                        }
                        prevName = this.userName;
                    } else {
                        if (this.groupName != null) {
                            html += this.groupName + ' ';
                        }
                    }
                });
                html += '</p>';
                outputUser.html(html);
                outputUser.toggleClass('hidden');
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });
    });

    //Update

    showUpdateUserForm.click(function () {
        formUpdateUser.toggleClass('hidden');
        var data = {};
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/users',
            success: function (data, status, xhr) {
                var html = '<table>';
                $(data).each(function (i) {

                    html +=
                        '<tr><td><i>userName: </i>' + this.userName + '</td><td><input name="updateRadio" type="radio" id="radio' + i + '"><input type="hidden" id="inputU' + i + '" value="' + this.userId + '"></td></tr>';
                    numberOfItems = i;
                });
                html += '</table><br><button id="showUserDataToUpdate" class="btn btn-info btn-large btn-light submitButton">Update</button>';
                formUpdateUser.html(html);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });

    });

    formUpdateUser.on('click', '#showUserDataToUpdate', function () {
        for (let i = 0; i <= numberOfItems; i++) {
            var radioId = '#radio' + i;
            var inputIdU = '#inputU' + i;
            var html = "";
            if ($(radioId).is(":checked")) {
                var url = 'http://localhost:8000/api/users/' + $(inputIdU).val();
                var data = {};
                $.ajax({
                    type: 'GET',
                    url: url,
                    success: function (data, status, xhr) {
                        html += '<table><tr>' +
                            '<td><label for="userNameU">userName</label></td>' +
                            '<td><input type="text" name="userNameU" id="userNameU" value="' + data[0].userName + '"></td>' +
                            '</tr><tr><td><label for="passwordU">Password</label></td>' +
                            '<td><input type="password" name="passwordU" id="passwordU" value="' + data[0].password + '"></td>' +
                            '</tr><tr><td><label for="firstNameU">firstName</label></td>' +
                            '<td><input type="text" name="firstNameU" id="firstNameU" value="' + data[0].firstName + '"></td>' +
                            '</tr><tr><td><label for="lastNameU">lastName</label></td><td>' +
                            '<input type="text" name="lastNameU" id="lastNameU" value="' + data[0].lastName + '"></td></tr>' +
                            '<tr><td> <label for="dateOfBirthU">dateOfBirth</label></td><td> ' +
                            '<input type="date" name="dateOfBirthU" id="dateOfBirthU" value="' + data[0].dateOfBirth + '"></td></tr></table><button id="updateUser" class="btn btn-info btn-large btn-light submitButton">Update</button><input id="userToUpdate" type="hidden" value="' + data[0].userId + '"></td></tr>';
                        $.ajax({
                            type: 'GET',
                            url: 'http://localhost:8000/api/groups',
                            success: function (data, status, xhr) {
                                var prevGroupName = "";
                                $(data).each(function (i) {
                                    if (prevGroupName != this.groupName) {
                                        html +=
                                            '<tr><td><i>GroupName: </i>' + this.groupName + '</td><td><input type="checkbox" id="checkboxGU' + i + '"><input type="hidden" id="inputGU' + i + '" value="' + this.groupId + '"></td></tr>';
                                        numberOfItems = i;
                                        prevGroupName = this.groupName;
                                    }
                                });
                                html += '</table>';

                                formUpdateUser.html(html);
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

    formUpdateUser.on('click', '#updateUser', function () {
        var groupList = [];
        for (let i = 0; i <= numberOfItems; i++) {
            var checkboxId = '#checkboxGU' + i;
            var inputId = '#inputGU' + i;
            if ($(checkboxId).is(":checked")) {
                groupList.push($(inputId).val());
            }
        }
        var inputId = $('#userToUpdate').val();
        var data = JSON.stringify({
            userName: $('#userNameU').val(),
            password: $('#passwordU').val(),
            firstName: $('#firstNameU').val(),
            lastName: $('#lastNameU').val(),
            dateOfBirth: $('#dateOfBirthU').val(),
            list: groupList
        });
        var url = 'http://localhost:8000/api/users/' + inputId;
        console.log(data);
        console.log(url);
        $.ajax({
            type: 'PATCH',
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
        formUpdateUser.toggleClass('hidden');
    });

    //DELETE

    showDeleteUserForm.click(function () {
        formDeleteUser.toggleClass('hidden');
        var data = {};
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/users',
            success: function (data, status, xhr) {
                var html = '<table>';
                $(data).each(function (i) {

                    html +=
                        '<tr><td><i>userName: </i>' + this.userName + '</td><td><input type="checkbox" id="checkbox' + i + '"><input type="hidden" id="input' + i + '" value="' + this.userId + '"></td></tr>';
                    numberOfItems = i;
                });
                html += '</table><br><button id="deleteUser" class="btn btn-info btn-large btn-light submitButton">Delete</button>';
                formDeleteUser.html(html);
            },
            error: function (xhr, status, error) {
                alert('Error occured: ' + status);
            }
        });

    });

    formDeleteUser.on('click', '#deleteUser', function () {
        for (let i = 0; i <= numberOfItems; i++) {
            var checkboxId = '#checkbox' + i;
            var inputId = '#input' + i;
            if ($(checkboxId).is(":checked")) {
                var url = 'http://localhost:8000/api/users/' + $(inputId).val();
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

        formDeleteUser.toggleClass('hidden');
    });

});
