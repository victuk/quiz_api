var express = require('express');
var router = express.Router();
const multer = require("multer");
const verifyAuth = require('../middleware/verifyAuth');
const rolesAllowed = require('../middleware/roleBasedAuth');
const userModel = require('../models/usersModel');
const {v4} = require("uuid");
const cloudinary = require("cloudinary");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/");
    },
    filename: (req, file, cb) => {

        const newFileName = v4() + "." + (file.mimetype).split("/")[1];
        cb(null, newFileName);

    }
});

const upload = multer({storage});

router.use(verifyAuth);

router.use(rolesAllowed(["user", "admin"]));

router.get("/profile", async (req, res, next) => {
    const userDetails = await userModel.findById(req.userDetails.userId, "-password");

    res.send(userDetails);

});


router.put("/profile-picture", upload.single("picture"), async (req, res, next) => {

    
    
    const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
        resource_type: "image",
        upload_preset: "kodecamp_4"
    });



    await userModel.findByIdAndUpdate(req.userDetails.userId, {
        profilePictureURL: uploadResult.secure_url
    });

    res.send({
        message: "Upload successful",
        newImage: uploadResult.secure_url
    });
});

module.exports = router;
