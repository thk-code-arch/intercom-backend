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
