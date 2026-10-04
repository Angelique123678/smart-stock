const { User } = require("../models");
const bcrypt = require("bcryptjs");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const yup = require("yup");

const addingOneTeacher = async (req, res) => {
  const { teachername, email, phone, password } = req.body;
  try {
    if (!teachername || !emailRegex.test(email) || !password)
      return res.status(400).json({ message: "all inputs are required" });
    const checkTeacher = await User.findOne({
      where: { email, role: "TEACHER" },
    });
    if (checkTeacher)
      return res.status(409).json({ message: "teacher already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacherDatas = {
      email,
      name: teachername,
      phone: phone ? phone : null,
      password: hashedPassword,
      role: "TEACHER",
    };
    const createTeacher = await User.create({ ...newTeacherDatas });
    if (!createTeacher)
      return res.status(500).json({ message: "teacher not created" });
    return res.status(200).json({
      message: "teacher created successfully",
      teacher: createTeacher,
    });
  } catch (error) {
    console.log("error occured while registering a teacher:", error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteTeachersController = async (req, res) => {
  const { teacherIds } = req.body;
  try {
    if (!Array.isArray(teacherIds))
      return res.status(400).json({ message: "teacherIds must be an array" });
    if (teacherIds.length === 0)
      return res.status(400).json({ message: "teacherIds must not be empty" });
    const ids = teacherIds.map((id) => parseInt(id));
    const succeededDeletedTeachers = [];
    const failedToDeleteTeachers = [];
    const existingTeachers = await User.findAll({
      where: {
        user_id: ids,
        role: "TEACHER",
      },
    });
    const existingTeacherMap = {}
    existingTeachers.forEach(teacher => {
      existingTeacherMap[teacher.user_id] = teacher
    })
    console.log("existing techers:", existingTeacherMap);

    const deletePromises = ids.map(id => {
      return new Promise(async (resolve) => {
        const teacher = existingTeacherMap[id]
        if (!teacher) {
          failedToDeleteTeachers.push({
            id,
            error: "teacher not found"
          })
          resolve()
          return
        }
        const teacherName = teacher.name

        const deletedTeacher = await User.destroy({
          where: { user_id: id, role: "TEACHER" }
        })

        if (deletedTeacher > 0) {
          succeededDeletedTeachers.push({
            id,
            message: `the teacher ${teacherName} deleted successfully`
          })
        } else {
          failedToDeleteTeachers.push({
            id,
            error: "failed to delete teacher"
          })
        }
        resolve()
        return;
      })
    })

    // await my deletepromises function
    await Promise.all(deletePromises)
    return res.status(200).json({
      deletedCount: succeededDeletedTeachers.length,
      failedCount: failedToDeleteTeachers.length,
      succeededDeletedTeachers,
      failedToDeleteTeachers,
    })
  } catch (error) {
    console.log("error occured while deleting a teacher:", error);
    return res.status(500).json({ message: error.message });
  }
};

const editTeacherController = async (req, res) => {
  const { teacherId } = req.params;
  const { teachername, email, phone } = req.body;
  try {
    if (!teacherId) return res.status(400).json({ message: "id required" });

    const teacher = await User.findOne({
      where: { user_id: teacherId, role: "TEACHER" },
    });
    if (!teacher) return res.status(404).json({ message: "teacher not found" });

    if (teachername) teacher.name = teachername;
    if (email) {
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "invalid email format" });
      }
      teacher.email = email;
    }
    if (phone) teacher.phone = phone;

    await teacher.save({
      returning: true
    });
    return res
      .status(200)
      .json({ message: "teacher updated successfully", teacher });
  } catch (error) {
    console.log("error occurred while editing a teacher:", error);
    return res.status(500).json({ message: error.message });
  }
};

const banTeacherController = async (req, res) => {
  const { teacherId } = req.params
  try {

    if (!teacherId) return res.status(400).json({ message: "id required" });

    const teacher = await User.findOne({
      where: { user_id: teacherId, role: "TEACHER" },
    });
    if (!teacher) return res.status(404).json({ message: "teacher not found" });

    const newteacher = await teacher.update({
      isBanned: true
    }, {
      where: {
        user_id: teacherId
      },
      returning: true
    })



    return res.status(200).json({ message: "updated successfully", teacher: newteacher })

  } catch (error) {
    console.log("error occurred while banning a teacher:", error);
    return res.status(500).json({ message: error.message });
  }
}
const unBanTeacherController = async (req, res) => {
  const { teacherId } = req.params
  try {

    if (!teacherId) return res.status(400).json({ message: "id required" });

    const teacher = await User.findOne({
      where: { user_id: teacherId, role: "TEACHER" },
    });
    if (!teacher) return res.status(404).json({ message: "teacher not found" });

    const newteacher = await teacher.update({
      isBanned: false
    }, {
      where: {
        user_id: teacherId
      },
      returning: true
    })



    return res.status(200).json({ message: "updated successfully", teacher: newteacher })

  } catch (error) {
    console.log("error occurred while banning a teacher:", error);
    return res.status(500).json({ message: error.message });
  }
}

const getAllTeachersController = async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: "TEACHER" }
    });
    if (!teachers.length) return res.status(404).status({ message: "no teacher found" });
    return res
      .status(200)
      .json({ message: "featching all teachers is a sucess", teachers });
  } catch (error) {
    console.log("an error occured when fetching all teachers:", error);
    return res.status(500).json({ message: error.message });
  }
};

// this is the function to validate the teacher data when adding many teachers
const teacherValidationSchema = yup.object({
  teachername: yup
    .string()
    .required("teachers name is required")
    .min(3, "name should be at least 3 characters"),
  email: yup
    .string()
    .email("invalid email format")
    .required("email is required"),
  phone: yup.string().nullable(),
  password: yup.string().required("password is required"),
});

// this is the function to add many teachers at once
const addManyTeachersController = async (req, res) => {
  const { teachers } = req.body;
  try {
    // check if the teachers data is an array and not empty
    if (!Array.isArray(teachers) || teachers.length === 0)
      return res
        .status(400)
        .json({ message: "teachers data must be an array and not empty" });

    const success = [];
    const failed = [];
    const validatedTeachers = [];

    for (const teacher of teachers) {
      try {
        await teacherValidationSchema.validate(teacher);
        validatedTeachers.push(teacher);
      } catch (error) {
        failed.push({
          email: teacher.email,
          error: error.message,
        });
      }
    }

    if (validatedTeachers.length === 0) {
      return res.status(400).json({
        message: "all teachers data are invalid",
        failed,
      });
    }
    //
    const emails = validatedTeachers.map((te) => te.email);
    const existingTeachers = await User.findAll({
      where: {
        email: emails,
        role: "TEACHER",
      },
    });
    const existingEmailsSet = new Set(existingTeachers.map((te) => te.email));
    // loop through the teachers data and validate each teacher data
    for (const teacher of validatedTeachers) {
      try {
        // check if the teacher already exists in the database
        // if the teacher already exists, push the error message to the failed array
        if (existingEmailsSet.has(teacher.email)) {
          failed.push({
            name: teacher.teachername,
            error: "teacher already exists",
          });
          continue;
        }
        // if the teacher data is valid, hash the password and create the teacher
        const hashedPassword = await bcrypt.hash(teacher.password, 10);
        success.push({
          name: teacher.teachername,
          email: teacher.email,
          password: hashedPassword,
        });
        // create the teacher in the database
        const newTeacherDatas = {
          name: teacher.teachername,
          email: teacher.email,
          phone: teacher.phone ? teacher.phone : null,
          password: hashedPassword,
          role: "TEACHER",
        };
        await User.create(newTeacherDatas);
      } catch (error) {
        failed.push({
          name: teacher.teachername,
          error: error.message,
        });
      }
    }
    res.status(200).json({
      successCount: success.length,
      failedCount: failed.length,
      success: success,
      failed: failed,
    });
  } catch (error) {
    console.log("error occured while adding many teachers:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addingOneTeacher,
  deleteTeachersController,
  editTeacherController,
  getAllTeachersController,
  addManyTeachersController,
  banTeacherController,
  unBanTeacherController
};
