# RSS Feed Scraper

## Getting Started

Follow these instructions to set up the project on your local machine for development and testing.

---

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or later)  
- **Yarn** (preferred package manager)  
- **PostgreSQL** (for the database)  
- **Prisma CLI** (optional, for database migrations)  

---

### Installation

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/sknhshrmn/rss-feed-scraper.git
   cd rss-feed-scraper

2. **Install Dependencies**  
   ```bash
   yarn install

### Configuration

1. **Set Up Environment Variables**
   Edit the .env file with your database credentials and server configuration:
   ```bash
   DATABASE_URL="postgresql://{username}:{password}@{host}:{port}/{database}?schema=public"
   PORT=3000
   HOST=http://localhost

  Replace {username}, {password}, {host}, {port}, and {database} with your database details.

2. **Apply Database Migrations**  
   ```bash
   npx prisma migrate dev

### Running the Application

1. **Start the Server**
   ```bash
   yarn start

The server will start and be accessible at:
http://localhost:{port}

### Testing

This project uses Swagger to provide interactive API documentation. Once the server is running, you can access the Swagger UI at:
http://localhost:{port}/api-docs



Feel free to reach out or open an issue if you encounter any problems! 😊
