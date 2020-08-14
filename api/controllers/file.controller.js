exports.uploadFile = (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let project = req.files.project;
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            project.mv('/files/' + project.name);
            //TODO add copy to subfolder for filehistory
            //TODO add DB entry in file table
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: project.name,
                    mimetype: project.mimetype,
                    size: project.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.uploadIFC = (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let project = req.files.project;
            var d = new Date();
            var filename = d.getMinutes()+d.getSeconds()+project.name;
            var file = filename.split('.').slice(0, -1).join('.');
            //Use the mv() method to place the file in upload directory (i.e.
            console.log(filename);
            project.mv('/files/input/' + filename);
            var outFilename = "/files/output/"+file+".gltf"
            var outLogfile = "/files/output/"+file+".log"
            Projectfile.create({
              filename: file+".gltf",
              path: "/files/output/",
              uploadedby: req.userId,
              projectId: req.currProject
              });
            res.send({
            status: true,
            message: 'File is uploaded',
            data: {
                name: project.name,
                mimetype: project.mimetype,
                logfile: outLogfile
            }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};
