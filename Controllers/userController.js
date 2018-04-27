var userController = function (db) {

    var post = function (req, res) {
        var errors = "";
        if (!req.body.userName) {
            res.status(400);
            res.send('userName is required');
        } else if (!req.body.password) {
            res.status(400);
            res.send('password is required');
        } else if (!req.body.firstName) {
            res.status(400);
            res.send('firstName is required');
        } else if (!req.body.lastName) {
            res.status(400);
            res.send('lastName is required');
        } else if (!req.body.dateOfBirth) {
            res.status(400);
            res.send('dateOfBirth is required');
        } else {
            let sql = `INSERT INTO Users (userName,password,firstName,lastName,dateOfBirth) VALUES ('${req.body.userName}','${req.body.password}','${req.body.firstName}','${req.body.lastName}','${req.body.dateOfBirth}')`;


            db.run(sql, function (err) {
                if (err) {
                    errors += err.message + '\n';
                    return console.error(err.message);
                }
            });
        }
        if (errors == "") {
            let sql2 = `SELECT userId as id FROM Users ORDER BY userId DESC LIMIT 1`;
            var id = 0;
            db.get(sql2, [], (err, row) => {
                if (err) {
                    errors += err.message + '\n';
                    return console.error(err.message);
                }
                id = row.id;
                let list = req.body.list;
                let listLength = list.length;
                var sql3 = "";
                for (let i = 0; i < listLength; i++) {
                    var sql3 = `INSERT INTO user_group (groupId,userId) SELECT groupId,${id} FROM Groups WHERE groupId= ${list[i]}`;
                    db.run(sql3, function (err) {
                        if (err) {
                            errors += err.message + '\n';
                            return console.error(err.message);
                        }
                    });
                }
                if (errors != "") {
                    res.send(errors);
                    res.status(500);
                } else {

                    res.send('POST success');
                    res.status(201);
                }
            });
        } else {
            res.send(errors);
            res.status(500);
        }
    }
    var get = function (req, res) {
        let sql = `SELECT Users.userId as id, Users.userName,Users.password, Users.firstName, Users.lastName, Users.dateOfBirth, user_group.groupId from Users JOIN user_group ON (Users.userId = user_group.userId)`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(500);
                res.send(err.message);
                throw err;
                return console.error(err.message);
            } else {
                res.status(200);
                res.send(rows);
            }
        });
    }

    var getId = function (req, res) {
        res.json(req.user);
        res.status(200);
    }

    var putId = function (req, res) {
        if (!req.body.userName) {
            res.status(400);
            res.send('userName is required');
        } else if (!req.body.password) {
            res.status(400);
            res.send('password is required');
        } else if (!req.body.firstName) {
            res.status(400);
            res.send('firstName is required');
        } else if (!req.body.lastName) {
            res.status(400);
            res.send('lastName is required');
        } else if (!req.body.dateOfBirth) {
            res.status(400);
            res.send('dateOfBirth is required');
        } else {
            let sql = `UPDATE Users SET userName = '${req.body.userName}',
                        password = '${req.body.password}',
                        firstName = '${req.body.firstName}',
                        lastName = '${req.body.lastName}',
                        dateOfBirth = '${req.body.dateOfBirth}'
                        WHERE userId = ${req.user.userId}`;
            db.run(sql, function (err) {
                if (err) {
                    res.send(err.message);
                    res.status(500);
                    return console.error(err.message);
                } else {
                    res.send('PUT success');
                    res.status(201);
                }
            });
        }
    }

    var patchId = function (req, res) {
        var sql = "";
        if (req.body.userName != null && req.body.userName != "") {
            sql += `UPDATE Users SET userName = '${req.body.userName}' WHERE userId = ${req.user.userId};`;
        } else if (req.body.password != null && req.body.password != "") {
            sql += `UPDATE Users SET password = '${req.body.password}' WHERE userId = ${req.user.userId};`;
        } else if (req.body.firstName != null && req.body.firstName != "") {
            sql += `UPDATE Users SET firstName = '${req.body.firstName}' WHERE userId = ${req.user.userId};`;
        } else if (req.body.lastName != null && req.body.lastName != "") {
            sql += `UPDATE Users SET lastName = '${req.body.lastName}' WHERE userId = ${req.user.userId};`;
        } else if (req.body.dateOfBirth != null && req.body.dateOfBirth != "") {
            sql += `UPDATE Users SET dateOfBirth = '${req.body.dateOfBirth}' WHERE userId = ${req.user.userId};`;
        } else {
            //list
        }
        if (sql != "") {
            db.run(sql, function (err) {
                if (err) {
                    res.send(err.message);
                    res.status(500);
                    return console.error(err.message);
                } else {
                    res.send('PATCH success');
                    res.status(201);
                }
            });
        }
    }

     var deleteId = function (req, res) {
        let sql = `DELETE FROM Users WHERE userId = '${req.user.userId}'`;
        db.run(sql, function (err) {
            if (err) {
                res.send(err.message);
                res.status(500);
                return console.error(err.message);
            } else {
                res.send("DELETE success");
                res.status(201);
            }
        });
    }
    

    return {
        post: post,
        get: get,
        getId: getId,
        putId: putId,
        patchId: patchId,
        deleteId: deleteId
    }
};

module.exports = userController;
