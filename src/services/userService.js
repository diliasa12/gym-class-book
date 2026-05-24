import User from "../models/user.model.js";
import Class from "../models/class.model.js";
export async function getAvailableClass() {
  const data = await Class.find({
    $expr: { $gt: ["$capacity", { $size: "$members" }] },
  });
  return {
    success: true,
    data: data,
  };
}
export async function tambahClass(id, userId) {
  const joinClass = await Class.findById(id);
  if (!joinClass) {
    const err = new Error("Class not found");
    err.statusCode = 404;
    throw err;
  }
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("USer not found");
    err.statusCode = 404;
    throw err;
  }
  const classIsExist = user.joinedClasses.some(
    (u) => u.toString() === id.toString(),
  );
  if (classIsExist) {
    const err = new Error("Class has been added");
    err.statusCode = 409;
    throw err;
  }
  const isFulled =
    joinClass.members.length >= joinClass.capacity ? true : false;
  if (isFulled) {
    const err = new Error("Class is full");
    err.statusCode = 409;
    throw err;
  }
  await User.updateOne(
    user,
    { $addToSet: { joinedClasses: joinClass._id } },
    { new: true },
  ).populate("joinedClasses");
  await Class.updateOne(joinClass, { $addToSet: { members: user._id } });
  return {
    success: true,
    message: "Successfully add class",
  };
}

export async function hapusClass(classId, email) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("USer not found");
    err.statusCode = 404;
    throw err;
  }
  const existingJoinedClass = user.joinedClasses.some(
    (id) => id.toString() === classId.toString(),
  );
  if (!existingJoinedClass) {
    const err = new Error("Class not found");
    err.statusCode = 404;
    throw err;
  }
  const classes = await Class.findById(classId);
  classes.members = classes.members.filter(
    (id) => id.toString() !== user._id.toString(),
  );
  await classes.save();
  user.joinedClasses = user.joinedClasses.filter(
    (id) => id.toString() !== classId.toString(),
  );

  await user.save();

  return {
    message: "Class removed from user successfully",
    data: user,
  };
}
