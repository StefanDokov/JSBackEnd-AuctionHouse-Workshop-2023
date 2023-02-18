const router = require('express').Router();
const auctionManager = require('../managers/auctionManager');
const {isAuthorized} = require('../middlewares/authMiddleware');
const {getErrorMessage} = require('../utils/errorUtils');

router.get('/browse', async(req,res) => {
   let offerts = await auctionManager.getAll();

   offerts = offerts.filter(x => x.isClosed == false);

    res.render('browse', {offerts});
});

router.get('/create', isAuthorized, (req, res) => {
   res.render('create');
});

router.post('/create', async(req, res) => {

    const auctionData = req.body;
    try{
       await auctionManager.create(req.user._id, auctionData);
    } catch(err){
        return res.status(400).render('create', {err: getErrorMessage(err)});
    }
       res.redirect('/browse');
});

router.get('/details/:auctionId', async(req, res) => {
    const auction = await auctionManager.getOne(req.params.auctionId).populate('author').populate('bidder').lean();
   
    const isOwner = auction.author._id == req.user?._id;

    if (isOwner) {
        return res.render('details-owner', { auction });
    }

    const isHbidder = auction.bidder?._id == req.user?._id;
   res.render('details', { auction, isHbidder });
   
});

router.get('/edit/:auctionId', async(req, res) => {
    
    const auction = await auctionManager.getOne(req.params.auctionId).populate('bidder').lean();
     
    res.render('edit', {auction});
});
router.post('/edit/:auctionId', async(req, res) =>{
    const auctionData = req.body;
    
    await auctionManager.updateOne(req.params.auctionId, auctionData);

    res.redirect('/');

});

router.get('/delete/:auctionId', async(req, res) => {
      await auctionManager.delete(req.params.auctionId);
      res.redirect('/');
});

router.post('/details/:auctionId', async(req, res) => {
        const auction = await auctionManager.getOne(req.params.auctionId).lean();
        const {prize} = req.body;

        if (auction.price >= prize) {
            const erro = new Error('Low price!')
            return res.render('details', {auction, err: getErrorMessage(erro)});
        }
        auction.price = prize;
        auction.bidder = req.user._id;
        await auctionManager.updatePrice(req.params.auctionId, auction);
        res.redirect('/');
});

router.get('/closed', async(req, res) => {
    let offerts = await auctionManager.getAll().populate('bidder').lean();

   offerts = offerts.filter(x => (x.isClosed == true) && (x.author == req.user?._id));
    
    res.render('closed-auctions', {offerts});
    
});

router.get('/close/:auctionId', async(req, res) => {
    const auction = await auctionManager.getOne(req.params.auctionId).lean();
    
     auction.isClosed = true;
     await auctionManager.updateOne(req.params.auctionId, auction);

     res.redirect('/');

});







module.exports = router;