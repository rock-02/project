const express = require('express');
const { giveComment, giveReply } = require('../controller/commentController');

const router = express.Router();

router.route('/:id').post(giveComment);
router.route('/reply/:id').post(giveReply);

module.exports = router;
