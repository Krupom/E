const {getAllCoworkingSpaces, getCoworkingSpaceById, createCoworkingSpace, updateCoworkingSpace, deleteCoworkingSpace} = require("../service/coworkingSpaceService");

//@desc     Get all CoworkingSpaces
//@route    GET /api/v1/spaces
//@access   Public
exports.getCoworkingSpaces = async (req, res) => {
  try {
    const { coworkingSpaces, pagination } = await getAllCoworkingSpaces(req.query);
    res.status(200).json({
      success: true,
      count: coworkingSpaces.length,
      pagination,
      data: coworkingSpaces,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

//@desc     Get a single CoworkingSpace
//@route    GET /api/v1/space/:id
//@access   Public
exports.getCoworkingSpace = async (req, res) => {
  try {
    const coworkingSpace = await getCoworkingSpaceById(req.params.id);
    res.status(200).json({
      success: true,
      data: coworkingSpace,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

//@desc     Create a CoworkingSpace
//@route    POST /api/v1/spaces
//@access   Private
exports.createCoworkingSpace = async (req, res) => {
  try {
    const coworkingSpace = await createCoworkingSpace(req.body);
    res.status(201).json({
      success: true,
      data: coworkingSpace,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

//@desc     Update CoworkingSpace
//@route    PUT /api/v1/space/:id
//@access   Private
exports.updateCoworkingSpace = async (req, res) => {
  try {
    const coworkingSpace = await updateCoworkingSpace(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: coworkingSpace,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

//@desc     Delete CoworkingSpace
//@route    DELETE /api/v1/space/:id
//@access   Private
exports.deleteCoworkingSpace = async (req, res) => {
  try {
    await deleteCoworkingSpace(req.params.id);
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};