const router = require("express").Router();
const {getAllTeachersController, addManyTeachersController, editTeacherController, deleteTeachersController, addingOneTeacher, banTeacherController, unBanTeacherController } = require("../controllers/Teacher-controller");
const { verifyTokenWithCookies, verifyAdminMiddleWare, verifyIfIsBanned } = require("../middleware/verify-token-middleware");

// all user routes only
router.use(verifyTokenWithCookies)
router.use(verifyIfIsBanned)
router.put("/edit/:teacherId", editTeacherController)
router.get("/get-teachers", getAllTeachersController)


//  admin only routes 
router.use(verifyAdminMiddleWare)
router.delete("/delete", deleteTeachersController)
router.post("/add-teacher", addingOneTeacher)
router.put("/ban-teacher/:teacherId", banTeacherController)
router.put("/unban-teacher/:teacherId", unBanTeacherController)
router.post("/add-many", addManyTeachersController)

module.exports = router;