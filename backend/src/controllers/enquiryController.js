const enquiryService = require('../services/enquiry.service');
const Res = require('../utils/Res');

exports.submitEnquiry = async (req, res) => {
  const enquiry = await enquiryService.create(req.body);
  return Res.created(res, { enquiry }, 'Enquiry submitted');
};

exports.getPublicEnquiries = async (req, res) => {
  const result = await enquiryService.listUnclaimed(req.query);
  return Res.success(res, result, 'Unclaimed enquiries fetched');
};

exports.getMyEnquiries = async (req, res) => {
  const result = await enquiryService.listClaimedBy(req.employee._id, req.query);
  return Res.success(res, result, 'Claimed enquiries fetched');
};

exports.claimEnquiry = async (req, res) => {
  const enquiry = await enquiryService.claim(req.params.id, req.employee._id);
  return Res.success(res, { enquiry }, 'Enquiry claimed');
};
