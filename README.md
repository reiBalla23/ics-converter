# iCal to JSON API

This is a simple Express.js API that converts iCal files to JSON format. It provides a single endpoint `/convert` for converting iCal files uploaded as `.ics` files.

## Getting Started

To get started with the project, follow these instructions:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ical-to-json-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the server:
   ```bash
   npm start
   ```

The server will start running on port 3000 by default.

## API Documentation

API documentation is available using Swagger UI. After starting the server, you can access the API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Usage

### Convert iCal to JSON

**Endpoint:** `POST /convert`

**Request Body:**
- Form Data: Upload a single `.ics` file with the key `file`.

**Response:**
- Status Code: 200 OK
- Response Body: JSON representation of the iCal file

## Dependencies

- [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express): Swagger UI Express middleware for Express.js
- [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc): Generate Swagger documentation from JSDoc comments
- [ical2json](https://www.npmjs.com/package/ical2json): Convert iCalendar (.ics) files to JSON format
- [multer](https://www.npmjs.com/package/multer): Middleware for handling multipart/form-data, used for file uploads

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
