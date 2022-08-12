const createServer = require('./server');

const app = createServer();
const PORT = process.env.PORT || 8080;


// Image with S3
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const { uploadFile, getFileStream } = require('./s3');

app.get('/images/:key', (req, res) => {
  const key = req.params.key;
  const readStream = getFileStream(key);
  readStream.pipe(res)
})

app.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);
  console.log({result})
  res.send({imagePath: `/images/${result.Key}`})
})

// Stripe Paiement
const stripe = require("stripe")('sk_test_51LAsZnEz9SrYVG8JLfHlscl1YsXNljJYAX2ETwpI25UxUfCBV7VKou5f1WYM5kPY51Iluhtr1PcA5kdp2z1xb2kH00vZsqoJyK')

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

// Stripe
app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
