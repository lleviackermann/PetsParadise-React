import express from "express";
import Product from "../../server/models/Product.js";
import { getOrSetCache, client } from "../lib/db.js";
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Dog:
 *       type: object
 *       properties:
 *         productType:
 *           type: string
 *           enum: [pet]
 *           description: The type of product (pet).
 *         petType:
 *           type: string
 *           enum: [dog]
 *           description: The type of pet (dog).
 *         name:
 *           type: string
 *           description: The name of the dog.
 *         breed_group:
 *           type: string
 *           description: The breed group of the dog.
 *         life_span:
 *           type: string
 *           description: The life span of the dog.
 *         price:
 *           type: number
 *           description: The price of the dog.
 *         src:
 *           type: string
 *           format: uri
 *           description: The image source of the dog.
 *         rating:
 *           type: number
 *           description: The rating of the dog.
 *       required:
 *         - productType
 *         - petType
 *         - name
 *         - breed_group
 *         - life_span
 *         - price
 *         - src
 *         - rating
 *     Cat:
 *       type: object
 *       properties:
 *         productType:
 *           type: string
 *           enum: [pet]
 *           description: The type of product (pet).
 *         petType:
 *           type: string
 *           enum: [cat]
 *           description: The type of pet (cat).
 *         name:
 *           type: string
 *           description: The name of the cat.
 *         breed_group:
 *           type: string
 *           description: The breed group of the cat.
 *         life_span:
 *           type: string
 *           description: The life span of the cat.
 *         price:
 *           type: number
 *           description: The price of the cat.
 *         src:
 *           type: string
 *           format: uri
 *           description: The image source of the cat.
 *         rating:
 *           type: number
 *           description: The rating of the cat.
 *       required:
 *         - productType
 *         - petType
 *         - name
 *         - breed_group
 *         - life_span
 *         - price
 *         - src
 *         - rating
 * /dog:
 *   get:
 *     summary: Get all dog products
 *     description: Retrieve a list of all dog products available.
 *     responses:
 *       '200':
 *         description: A list of dog products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dog'
 * /cat:
 *   get:
 *     summary: Get all cat products
 *     description: Retrieve a list of all cat products available.
 *     responses:
 *       '200':
 *         description: A list of cat products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cat'
 */

router.get("/dog", async (req, res) => {
  console.log("got request");
  let pets;

  getOrSetCache("Products:dogs", 60, async () => {
    try {
      pets = await Product.find({ productType: "pet", petType: "dog" });

      // const petData = pets.map((pet, index) => [index, JSON.stringify(pet)]);
      return pets;
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }).then((pets) => {
    res.status(200).send(pets);
  });

  // client.hgetall("Products:dogs", async (err, cachedData) => {
  //   if (err) {
  //     console.error("Redis error:", err);
  //     return res.status(500).send({ error: "Internal Server Error" });
  //   }

  //   if (cachedData && Object.keys(cachedData).length !== 0) {
  //     console.log("Retrieved dogs data from Redis cache");
  //     const cachedPets = Object.values(cachedData).map(JSON.parse);

  //     // Send the cached data to the client
  //     res.status(200).send(cachedPets);
  //   } else {
  //     console.log(
  //       `Data for dogs not present in Redis Cache, calculating and adding to the database`
  //     );

  //     try {
  //       pets = await Product.find({ productType: "pet", petType: "dog" });
  //       console.log(pets);

  //       const petData = pets.map((pet, index) => [index, JSON.stringify(pet)]);
  //       client.hmset("Products:dogs", ...petData, (err, response) => {
  //         if (err) {
  //           console.error("Error storing data in Redis:", err);
  //         } else {
  //           console.log("Data stored in Redis for key 'Products:dogs'");
  //           client.expire("Products:dogs", 600, (err, reply) => {
  //             if (err) {
  //               console.error(
  //                 "Error setting expiration time for key 'Products:dogs':",
  //                 err
  //               );
  //             } else {
  //               console.log(
  //                 "Expiration time set for key 'Products:dogs': 3600 seconds"
  //               );
  //             }
  //           });
  //         }
  //       });

  //       res.status(200).send(pets);
  //     } catch (error) {
  //       console.error("Database error:", error);
  //       return res.status(500).send({ error: "Internal Server Error" });
  //     }
  //   }
  // });
});

router.get("/cat", async (req, res) => {
  console.log("got request");
  let pets;
  getOrSetCache("Products:cats", 60, async () => {
    try {
      pets = await Product.find({ productType: "pet", petType: "cat" });
      return pets;
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }).then((pets) => {
    res.status(200).send(pets);
  });
});

export default router;
