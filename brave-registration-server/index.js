const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const axios = require("axios");
const globalStorage = require("node-global-storage");
const { v4: uuidv4 } = require("uuid");

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jazz428.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // ===== Collections ===== //
    const coursesCollection = client.db("braveEducation").collection("courses");
    const scheduleCollection = client
      .db("braveEducation")
      .collection("schedule");
    const registrationsCollection = client
      .db("braveEducation")
      .collection("registrations");

    // ===== Middlewares ===== //
    const bkash_auth = async (req, res, next) => {
      const details = req.body.details;
      globalStorage.set("details", details, { protected: true });
      globalStorage.unset("id_token");
      try {
        const { data } = await axios.post(
          process.env.bkash_grant_token_url,
          {
            app_key: process.env.bkash_api_key,
            app_secret: process.env.bkash_secret_key,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              username: process.env.bkash_username,
              password: process.env.bkash_password,
            },
          }
        );

        // Store the token in global storage
        globalStorage.set("id_token", data?.id_token, { protected: true });

        next();
      } catch (error) {
        return res
          .status(400)
          .send({ message: "error", error: error?.message });
      }
    };

    // ===== APIs ===== //
    app.get("/api/v1/courses", async (req, res) => {
      try {
        const filter = {};
        const id = req.query.id;
        if (!req.query.all) {
          filter.active = true;
        }
        if (id) {
          filter._id = new ObjectId(id);
        }
        const result = await coursesCollection.find(filter).toArray();
        res.send(result);
      } catch (error) {
        return res
          .status(400)
          .send({ message: "error", error: error?.message });
      }
    });

    app.get("/api/v1/schedule", async (req, res) => {
      try {
        const filter = {};
        const course = req.query.course;
        if (course) {
          filter.course = course;
        }
        const date = req.query.date;
        if (date) {
          filter.date = date;
        }
        const result = await scheduleCollection.find(filter).toArray();
        res.send(result);
      } catch (error) {
        return res
          .status(400)
          .send({ message: "error", error: error?.message });
      }
    });

    // Physical Checkout
    app.post("/api/v1/physical-checkout", async (req, res) => {
      try {
        const { courseId, details } = req.body;

        const check = await registrationsCollection.findOne({
          course: courseId,
          name: details.name,
          phone: details.phone,
        });
        if (check) {
          return res.send({
            message: "You already registered in this course.",
          });
        }

        const course = await coursesCollection.findOne({
          _id: new ObjectId(courseId),
        });
        const price = course?.offerPrice;
        const uid = "BE" + uuidv4().substring(0, 5);
        details.uid = uid;
        if (price === 0) {
          details.paid = true;
        } else {
          details.paid = false;
        }
        const result = await registrationsCollection.insertOne(details);
        if (result.insertedId) {
          return res.send({ message: "success", uid, paid: details?.paid });
        } else {
          return res.send({ message: "Failed to insert in DB" });
        }
      } catch (error) {
        return res
          .status(400)
          .send({ message: "error", error: error?.message });
      }
    });

    // bKash Checkout
    app.post("/api/v1/bkash-checkout", bkash_auth, async (req, res) => {
      try {
        const courseId = req.body.courseId;
        const course = await coursesCollection.findOne({
          _id: new ObjectId(courseId),
        });
        const price = course?.offerPrice;

        const { data } = await axios.post(
          process.env.bkash_create_payment_url,
          {
            mode: "0011",
            payerReference: " ",
            callbackURL: "http://localhost:4000/api/v1/bkash-execute-payment",
            amount: price,
            currency: "BDT",
            intent: "sale",
            merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: globalStorage.get("id_token"),
              "x-app-key": process.env.bkash_api_key,
            },
          }
        );

        res.send({ bkashURL: data?.bkashURL });
      } catch (error) {
        return res
          .status(400)
          .send({ message: "error", error: error?.message });
      }
    });

    app.get("/api/v1/bkash-execute-payment", async (req, res) => {
      try {
        const { status, paymentID } = req.query;

        if (status === "cancel") {
          return res.redirect(`http://localhost:5173/checkout?status=canceled`);
        } else if (status === "failure") {
          return res.redirect(`http://localhost:5173/checkout?status=failed`);
        }

        if (paymentID && status === "success") {
          try {
            const { data } = await axios.post(
              process.env.bkash_execute_payment_url,
              { paymentID },
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: globalStorage.get("id_token"),
                  "x-app-key": process.env.bkash_api_key,
                },
              }
            );

            if (data && data?.statusCode === "0000") {
              const uid = "BE" + uuidv4().substring(0, 5);
              const details = globalStorage.get("details");
              details.paid = true;
              details.uid = uid;
              console.log(details);
              const result = await registrationsCollection.insertOne(details);
              if (result.insertedId) {
                return res.redirect(
                  `http://localhost:5173/checkout?status=successful&uid=${uid}`
                );
              } else {
                return res.redirect(
                  `http://localhost:5173/checkout?status=failed_to_post_in_db`
                );
              }
            }
          } catch (error) {
            return res
              .status(400)
              .send({ message: "error", error: error?.message });
          }

          // return res.redirect(
          //   `http://localhost:5173/checkout?status=${query.status}&paymentID=${query.paymentID}`
          // );
        }

        return res.redirect(`http://localhost:5173/checkout?status=failed`);
      } catch (error) {
        return res
          .status(400)
          .send({ message: "error", error: error?.message });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Brave Educations's server.");
});

app.listen(port, () => {
  console.log(`Brave Education's server is running on port ${port}`);
});
