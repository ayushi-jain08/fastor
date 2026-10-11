const Enquiry = require('../models/Enquiry');
const ApiError = require('../utils/ApiError');

async function paginate(filter, sort, { page, limit }) {
  const [items, total] = await Promise.all([
    Enquiry.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Enquiry.countDocuments(filter),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

const create = (data) => Enquiry.create(data);

const listUnclaimed = (paging) => paginate({ claimedBy: null }, { createdAt: -1 }, paging);

const listClaimedBy = (employeeId, paging) => paginate({ claimedBy: employeeId }, { claimedAt: -1 }, paging);

async function claim(enquiryId, employeeId) {
  const enquiry = await Enquiry.findOneAndUpdate(
    { _id: enquiryId, claimedBy: null },
    { claimedBy: employeeId, claimedAt: new Date() },
    { returnDocument: 'after', lean: true }
  );
  if (enquiry) return enquiry;

  const exists = await Enquiry.exists({ _id: enquiryId });
  throw exists ? ApiError.conflict('Enquiry already claimed') : ApiError.notFound('Enquiry not found');
}

module.exports = { create, listUnclaimed, listClaimedBy, claim };
