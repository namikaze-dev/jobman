# Jobman (Job Search API)

This API allows users to create, update, get, and delete job listings, as well as subscribe to job email notifications based on selected tags. The payment is handled via Stripe, and a RabbitMQ listener sends email notifications to subscribers when a job matching their selected tags is created. 

## Features
- Create job
- Update job
- Get job
- Get all jobs
- Delete job
- Subscribe to job emails by selecting tags and creating a payment with Stripe
- RabbitMQ listener sends email to subscribed users when a job matching their tags is created

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- Stripe API
- RabbitMQ
- Nodemailer

## How to Use
1. Clone this repository
2. Install dependencies with `npm install`
3. Set environment variables or copy the **example.env** file to a new **.env** file and modify as needed
4. Start the server with `node start`

## Endpoints
- POST `/jobs` - create a new job listing
- PUT `/jobs/:id` - update an existing job listing
- GET `/jobs/:id` - get a single job listing
- GET `/jobs` - get all job listings
- DELETE `/jobs/:id` - delete a job listing
- POST `/jobs/subscriptions` - create a new job subscription with selected tags and payment with Stripe

## Contributing
Contributions are welcome! Please submit a pull request or open an issue.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
