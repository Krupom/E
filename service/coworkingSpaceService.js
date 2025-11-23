const CoworkingSpace = require("../models/CoworkingSpace");
const Reservation = require("../models/Reservation");
const createError = require('http-errors');

exports.getAllCoworkingSpaces = async (queryParams) => {
  const reqQuery = { ...queryParams };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  let query = CoworkingSpace.find(JSON.parse(queryStr)).populate("reservations waitlist");

  if (queryParams.select) {
    const fields = queryParams.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (queryParams.sort) {
    const sortBy = queryParams.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await CoworkingSpace.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const coworkingSpaces = await query;

  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  return { coworkingSpaces, pagination };
};

exports.getCoworkingSpaceById = async (id) => {
  const coworkingSpace = CoworkingSpace.findById(id);
  if (!coworkingSpace) {
    throw createError(404, `Coworking space with ID ${id} not found`);
  }
  return coworkingSpace;
};

exports.createCoworkingSpace = async (data) => {
  const {openTime, closeTime} = data;
  const opentime = openTime.split(":");
  const closetime = closeTime.split(":");
  const open = parseInt(opentime[0]) * 60 + parseInt(opentime[1]);
  const close = parseInt(closetime[0]) * 60 + parseInt(closetime[1]);
  if(close <= open){
    throw createError(400, 'openTime mush be before closeTime');
  }
  return CoworkingSpace.create(data);
};

exports.updateCoworkingSpace = async (id, data) => {
  const updated = await CoworkingSpace.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw createError(404, `Coworking space with ID ${id} not found`);
  }
  return updated;
};

exports.deleteCoworkingSpace = async (id) => {
  const exist = await CoworkingSpace.findById(id);
  if (!exist) {
    throw createError(404, `Coworking space with ID ${id} not found`);
  }
  await Reservation.deleteMany({ space: id });
  await CoworkingSpace.deleteOne({ _id: id });
};
