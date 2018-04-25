var groupController = function (db) {

    var post = function (req, res) {
        let sql = `INSERT INTO Groups (groupName) VALUES ('${req.body.groupName}')`;

        if (!req.body.groupName) {
            res.status(400);
            res.send('groupName is required');
        } else {
            db.run(sql, function (err) {
                if (err) {
                    return console.error(err.message);
                }
            });
        }
        let sql2 = `SELECT groupId as id FROM Groups ORDER BY groupId DESC LIMIT 1`;
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
                var sql3 = `INSERT INTO user_group (userId,groupId) SELECT userId,${id} FROM Users WHERE userId= ${list[i]}`;
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
        let sql = `SELECT * from Groups LEFT JOIN user_group ON Groups.groupId = user_group.groupId`;
        //let sql = `SELECT * from user_group`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
                return console.error(err.message);
            }

            res.status(200);
            res.send(rows);

        });
    }
    var getId = function (req, res) {
        res.json(req.group);
    }

    var put = function (req, res) {
        let sql = `UPDATE Groups SET groupName = '${req.body.groupName}' WHERE groupId = ${req.group.groupId}`;
        db.run(sql, function (err) {
            if (err) {
                return console.error(err.message);
            }
        });
        res.send('PUT success');
        res.status(201); //spr
    }

    var patchId = function (req, res) {
        let sql = `UPDATE Groups SET groupName = '${req.body.groupName}' WHERE groupId = ${req.group.groupId}`;
        db.run(sql, function (err) {
            if (err) {
                return console.error(err.message);
            }
        });
        res.send('PUT success');
        res.status(201); //spr
    }
    
    var deleteId = function(req,res){
        
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
