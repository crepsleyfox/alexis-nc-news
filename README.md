# Northcoders News API

## Running Locally

To run and connect to the project locally, follow these steps

### 1. Create Environment Variable Files

Create two environment variable files: `.env.test` and `.env.development`.

### 2. Configure Database Connection

In each file, add the following environment variables:

```plaintext
# For .env.test
PGDATABASE=your_test_database_name

# For .env.development
PGDATABASE=your_development_database_name
```


### 3. Verify .gitignore

Ensure that the `.env.*` files are being ignored by looking in the `.gitignore` file. If not add them manually to prevent any sensitive information from being committed to the public version

### 4. Install Dependencies and Run

Run the following command to install dependencies
```plaintext
npm install
```


