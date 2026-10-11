const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const schema = require('../validations/enquiry.validation');
const {
  submitEnquiry,
  getPublicEnquiries,
  getMyEnquiries,
  claimEnquiry,
} = require('../controllers/enquiryController');

router.post('/', validate(schema.submit), submitEnquiry);

router.get('/public', auth, validate(schema.list), getPublicEnquiries);
router.get('/private', auth, validate(schema.list), getMyEnquiries);
router.patch('/:id/claim', auth, validate(schema.claim), claimEnquiry);

module.exports = router;
