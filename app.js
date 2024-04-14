const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const ical2json = require('ical2json');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser')

const app = express();
const PORT = process.env.PORT || 3000;

// Multer configuration for file upload
const upload = multer({
  dest: 'uploads/',
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'iCal to JSON API',
      version: '1.0.0',
      description: 'Convert iCal files to JSON format',
    },
  },
  apis: ['./app.js'],
};

// create application/json parser
var jsonParser = bodyParser.json()

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /convert:
 *   post:
 *     summary: Convert iCal file to JSON
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: JSON representation of the iCal file
 */
app.post('/convert', upload.single('file'), (req, res) => {
  if (!req.file || req.file.mimetype !== 'text/calendar') {
    return res.status(400).json({ error: 'Please upload a valid .ics file' });
  }

  fs.readFile(req.file.path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading the uploaded file' });
    }

    try {
      const jsonResult = ical2json.convert(data);
      res.json(jsonResult);
    } catch (error) {
      res.status(400).json({ error: 'Invalid iCal data' });
    } finally {
      // Remove the uploaded file after processing
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting uploaded file:', err);
        }
      });
    }
  });
});

/**
 * @swagger
 * /convert/json:
 *   post:
 *     summary: Convert a list of iCal data from JSON with base64 encoded content
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: base64
 *     responses:
 *       200:
 *         description: List of JSON representations of the iCal data
 */
app.post('/convert/json', jsonParser, (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'The "data" property must be an array of base64-encoded strings' });
  }

  const jsonResults = [];

  try {
    for (const icalData of data) {
      const jsonData = ical2json.convert(Buffer.from(icalData, 'base64').toString('utf-8'));
      jsonResults.push(jsonData);
    }

    res.json(jsonResults);
  } catch (error) {
    res.status(400).json({ error: 'Invalid base64 encoded iCal data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
