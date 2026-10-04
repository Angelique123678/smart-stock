const router = require("express").Router();
const { verifyTokenWithCookies, verifyAdminMiddleWare, verifyIfIsBanned } = require("../middleware/verify-token-middleware");
const { getAllTrades, getOneTrade, createTrade, updateTrade, deleteTrade } = require("../controllers/Trade-controllers");


// all user trade routes
router.use(verifyTokenWithCookies)
router.use(verifyIfIsBanned)
router.get("/getAll", getAllTrades);
router.get("/getOne/:tradeId", getOneTrade);

//  admin only routes
router.use(verifyAdminMiddleWare)
router.post("/create", createTrade);
router.put("/update/:tradeId", updateTrade);
router.delete("/delete", deleteTrade);


module.exports = router;