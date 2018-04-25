var userController = function (db) {

    var post = function (req, res) {
        let sql = `INSERT INTO Users (userName,password,firstName,lastName,dateOfBirth) VALUES ('${req.body.userName}','${req.body.password}','${req.body.firstName}','${req.body.lastName}','${req.body.dateOfBirth}')`;

        if (!req.body.userName) {
            res.status(400);
            res.send('userName is required');
        } else {
            db.run(sql, function (err) {
                if (err) {
                    return console.error(err.message);
                }
            });
        }
        let sql2 = `SELECT userId as id FROM Users ORDER BY userId DESC LIMIT 1`;
        var id = 0;
        db.get(sql2, [], (err, row) => {
            if (err) {
                throw err;
                return console.error(err.message);
            }
            id = row.id;
            let list = req.body.list;
            let listLength = list.length;
            var sql3 = "";
            for (let i = 0; i < listLength; i++) {
                var sql3 = `INSERT INTO user_group (userId,groupId) SELECT groupId,${id} FROM Groups WHERE groupId= ${list[i]}`;
                db.run(sql3, function (err) {
                    if (err) {
                        return console.error(err.message);
                    }
                });
            }

            res.send('POST success');
            res.status(201);
        });



    }
    var get = function (req, res) {
        let sql = `SELECT * from Users JOIN user_group ON (Users.userId = user_group.userId)`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
                return console.error(err.message);
            }
            rows.forEach(function(row){
                
            })
            res.status(200);
            res.send(rows);

        });
    }
    return {
        post: post,
        get: get
    }
};

module.exports = userController;
