import mongoose from 'mongoose';
import { Location } from '../models/Location.js';
import adventuredatas from '../models/AdventureData.js';
import restaurantdatas from '../models/RestaurantData.js';
import scenerydatas from '../models/SceneryData.js';
import resortsdatas from '../models/ResortsData.js';
import gamesdatas from '../models/GamesData.js';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

// export const addLocation = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { baseData, categoryData } = req.body;

//     const {
//       placeName,
//       description,
//       city,
//       state,
//       country,
//       categoryName,
//       categoryId,
//       locationUrl
//     } = baseData;


//     const location = await Location.create([{
//       placeName,
//       description,
//       city,
//       state,
//       country,
//       categoryName,
//       categoryId,
//       locationUrl
//     }], { session });

//     const locationId = location[0]._id;

//     let DataModel;

//     switch (categoryName.toLowerCase()) {
//       case 'adventure':
//         DataModel = adventuredatas;
//         break;
//       case 'restaurant':
//         DataModel = restaurantdatas;
//         break;
//       case 'scenery':
//         DataModel = scenerydatas;
//         break;
//       case 'resorts':
//         DataModel = resortsdatas;
//         break;
//       case 'games':
//         DataModel = gamesdatas;
//         break;
//       default:
//         throw new Error('Invalid category');
//     }


//     await DataModel.create([{
//       locationId,
//       ...categoryData
//     }], { session });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       success: true,
//       message: 'Location added successfully',
//       locationId
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

export const addLocation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 🔹 Extract directly from req.body (NO baseData anymore)
    const {
      placeName,
      description,
      area,
      city,
      state,
      country,
      categoryName,
      categoryId,
      locationUrl
    } = req.body;

    const categoryData = JSON.parse(req.body.categoryData);

    // 🔹 Upload Images
    const imageUrls = [];

    if (!req.files || req.files.length === 0) {
      throw new Error("No images uploaded");
    }

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `destiknow/${categoryName}`
      });

      imageUrls.push(result.secure_url);

      fs.unlinkSync(file.path);
    }

    // 🔹 Create Location
    const location = await Location.create([{
      placeName,
      description,
      city,
      state,
      country,
      categoryName,
      categoryId: Number(categoryId),
      locationUrl,
      images: imageUrls
    }], { session });

    const locationId = location[0]._id;

    let DataModel;

    switch (categoryName.toLowerCase()) {
      case 'adventure':
        DataModel = adventuredatas;
        break;
      case 'restaurant':
        DataModel = restaurantdatas;
        break;
      case 'scenery':
        DataModel = scenerydatas;
        break;
      case 'resorts':
        DataModel = resortsdatas;
        break;
      case 'games':
        DataModel = gamesdatas;
        break;
      default:
        throw new Error('Invalid category');
    }

    // 🔹 Insert category-specific data (convert numbers!)
    await DataModel.create([{
      locationId,
      area,
      ...categoryData,
      numberAllowed: Number(categoryData.numberAllowed),
      budget: Number(categoryData.budget)
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Location added successfully",
      locationId
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};