var groupController = function (db) {

    var post = function (req, res) {
        var errors = "";
        if (!req.body.groupName) {
            res.status(400);
            res.send('groupName is required');
        } else {
            let sql = `INSERT INTO Groups (groupName) VALUES ('${req.body.groupName}')`;
            db.run(sql, function (err) {
                if (err) {
                    errors += err.message + '\n';
                    return console.error(err.message);
                }
            });
        }
        if (errors == "") {
            let sql2 = `SELECT groupId as id FROM Groups ORDER BY groupId DESC LIMIT 1`;
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
                    var sql3 = `INSERT INTO user_group (userId,groupId) SELECT userId,${id} FROM Users WHERE userId= ${list[i]}`;
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
        let sql = `SELECT Groups.groupId as id, groupName, user_group.userId,(SELECT u.userName from Users u where u.userId = user_group.userId) as userName from Groups LEFT JOIN user_group ON Groups.groupId = user_group.groupId`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(500);
                res.send(err.message);
                throw err;
                return console.error(err.message);
            } else {
                rows.forEach((row) => {
                    row.groupId = row.id;
                    delete row.id;
                });
                res.status(200);
                res.send(rows);
            }


        });
    }
    var getId = function (req, res) {
        let sql = `SELECT Groups.groupId as id, groupName, user_group.userId from Groups LEFT JOIN user_group ON Groups.groupId = user_group.groupId WHERE Groups.groupId = ${req.group.groupId}`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(500);
                res.send(err.message);
                throw err;
                return console.error(err.message);
            } else {
                rows.forEach((row) => {
                    row.groupId = row.id;
                    delete row.id;
                });
                res.status(200);
                res.send(rows);
            }
        });
    }

    var putId = function (req, res) {
        if (!req.body.groupName) {
            res.status(400);
            res.send('groupName is required');
        }else if(!req.body.list){
            res.status(400);
            res.send('list is required');
        } else {
            let sql = `UPDATE Groups SET groupName = '${req.body.groupName}' WHERE groupId = ${req.group.groupId}`;
            db.run(sql, function (err) {
                if (err) {
                    res.send(err.message);
                    res.status(500);
                    return console.error(err.message);
                } else {
                    let sql2 = `DELETE FROM user_group WHERE groupId= ${req.group.groupId};`;
                    db.run(sql2, function (err) {
                        if (err) {
                            errors += err.message + '\n';
                            return console.error(err.message);
                        }
                    });
                    if (req.body.list.length > 0) {
                        for (let i = 0; i < req.body.list.length; i++) {
                            let sql3 = `INSERT INTO user_group (userId,groupId) SELECT userId,${req.group.groupId} FROM Users WHERE userId= ${req.body.list[i]};`;
                            db.run(sql3, function (err) {
                                if (err) {
                                    errors += err.message + '\n';
                                    return console.error(err.message);
                                }
                            });
                        }

                    }
                    res.send('PUT success');
                    res.status(201);
                }
            });
        }
    }

    var patchId = function (req, res) {
        var sql = [];
        if (req.body.groupName != null && req.body.groupName != "") {
            sql.push(`UPDATE Groups SET groupName = '${req.body.groupName}' WHERE groupId = ${req.group.groupId}`);
        } 
        if (req.body.list != null) {
            sql.push(`DELETE FROM user_group WHERE groupId= ${req.group.groupId};`);
            for (let i = 0; i < req.body.list.length; i++) {
                sql.push(`INSERT INTO user_group (userId,groupId) SELECT userId,${req.group.groupId} FROM Users WHERE userId= ${req.body.list[i]};`);
            }
        }
        for (let i = 0; i < sql.length; i++) {
            db.run(sql[i], function (err) {
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
        let sql = `DELETE FROM Groups WHERE groupId = '${req.group.groupId}'`;
        db.run(sql, function (err) {
            if (err) {
                res.send(err.message);
                res.status(500);
                return console.error(err.message);
            } else {
                let sql2 = `DELETE FROM user_group WHERE groupId= ${req.group.groupId};'`;
                db.run(sql2, function (err) {
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

module.exports = groupController;
