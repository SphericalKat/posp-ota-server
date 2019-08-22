require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const {check, validationResult} = require('express-validator');
const router = express.Router();
const Device = mongoose.model('Device');
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', auth.connect(basic), (req, res) => {
    res.render('form', {title: 'Lucid Updates'});
});

/**
 * @api {get} /checkUpdate Check if update exists
 * @apiName GetCheckUpdate
 * @apiGroup Update
 * @apiVersion 1.0.0
 *
 * @apiParam {String} device The user's device
 * @apiParam {Number} date The build date in the format "yymmdd"
 *
 * @apiSuccess {Object[]} response List of available updates
 * @apiSuccess {Number} response.datetime Build date expressed as UNIX timestamp
 * @apiSuccess {String} response.filename Name of the file to be downloaded
 * @apiSuccess {String} response.id A string that uniquely identifies the update
 * @apiSuccess {String} response.romtype The release type
 * @apiSuccess {String} response.size Size of the update expressed in bytes
 * @apiSuccess {String} response.url URL of the file to be downloaded
 * @apiSuccess {String} response.version Version to be compared against a prop
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * {
    "response": [
        {
            "datetime": 1551462180,
            "filename": "project_beryllium-9-20190302.test-v2.1.WEEKLY.zip",
            "id": "6f115c557c665548978795c84791c9c0",
            "romtype": "weekly",
            "size": 528541416,
            "url": "https://mirror.project.co/beryllium/weeklies/project_beryllium-9-20190302.test-v2.1.WEEKLY.zip",
            "version": "2.1"
        }
    ]
}
 *
 * @apiError DeviceNotFound The device was not found
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 404 Not Found
 *  {
 *      "error": "DeviceNotFound"
 *  }
 *
 */
router.get('/:device/:type',[
    check('device').isString().not().isEmpty(),
    check('type').isString().not().isEmpty()

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: "ValidationFailed",
            err: errors.array()
        });
    }

    const {device: reqDevice, type: channelType} = req.params;
    let returnJson = [];
    try {
        await Device.find({devicename: reqDevice, romtype: channelType}, async (err, devices) => {
            if (devices === null) {
                res.status(404).send({error: "DeviceNotFound"});
            } else {
                for (let index = 0; index < devices.length; index++) {
                    let currentDevice = devices[index];
                    returnJson.push(
                        {
                            datetime: Number(currentDevice.get('datetime')),
                            filename: currentDevice.get('filename'),
                            id: currentDevice.get('id'),
                            romtype: currentDevice.get('romtype'),
                            size: Number(currentDevice.get('size')),
                            url: currentDevice.get('url'),
                            version: currentDevice.get('version')
                        }
                    )
                }
                res.status(200).send({
                    response: returnJson
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.status(404).send({error: "DeviceNotFound"});
    }
});

// Submit route
router.post('/pushUpdate', auth.connect(basic),
    [
        check('devicename')
            .isLength({min: 1})
            .withMessage('Please enter the device name.'),
        check('datetime')
            .isLength({min: 1})
            .isNumeric()
            .withMessage('Please enter the datetime.'),
        check('filename')
            .isLength({min: 1})
            .withMessage('Please enter the file name'),
        check('id')
            .isLength({min: 1})
            .withMessage('Please enter the id.'),
        check('romtype')
            .isLength({min: 1})
            .withMessage('Please enter the release type'),
        check('size')
            .isLength({min: 1})
            .isNumeric()
            .withMessage('Please enter the file size.'),
        check('url')
            .isURL({require_valid_protocol: true})
            .withMessage('Please enter a valid URL'),
        check('version')
            .isLength({min: 1})
            .withMessage('Please enter the version.'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const updateDevice = new Device(req.body);
            updateDevice.save().catch(error => {
                console.log(error);
            });
            res.status(200).send({response: 'Successfully saved', err: null});
        } else {
            res.render('form', {
                title: 'Lucid Updates',
                errors: errors.array(),
                data: req.body
            });
        }
    });

// delete route
router.post('/deleteUpdate', auth.connect(basic),
    [
        check('hash')
            .isLength({min: 1})
            .withMessage('Please enter a valid ID')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            Device.delete({id: req.body.hash}).then(() => {
                res.status(200).send({response: 'Successfully deleted update', err: null});
            }).catch((error) => {
                res.status(404).send({response: 'Update not found', err: error});
            });
        }
    });

module.exports = router;