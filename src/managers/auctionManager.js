const Auction = require('../models/Auction');

exports.getAll = () => Auction.find({}).lean();

exports.create = (authorId, auctionData) => Auction.create({...auctionData, author: authorId, isClosed: false});

exports.getOne = (auctionId) => Auction.findById(auctionId);

exports.updateOne = (auctionId, auctionData) => Auction.findByIdAndUpdate(auctionId, auctionData,{runValidators: true});

exports.delete = (auctionId) => Auction.findByIdAndDelete(auctionId);

exports.updatePrice = (auctionId, auctionData) => Auction.findByIdAndUpdate(auctionId, auctionData, {runValidators: true});