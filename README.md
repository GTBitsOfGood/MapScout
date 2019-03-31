# PACTS Project
Description

### Development

Create and configure the env.sh file to have the below variables. These are your local environment variables for local development and therefore can be separate from those on heroku.

```javascript
# env.sh
export MONGODB_URI="mongodb://name:here@example.mlab.com:11111/name-of-db";
export SESSION_SECRET="enter_a_session_secret";
export HOST_EMAIL_ROUTE="http://either_local_or_production";
```

The app can use AWS or Azure storage for images. Configure which storage
service to use with:

```
export STORAGE_SERVICE=[AWS | Azure]
```

AWS and Azure require different configuration variables. If you are using AWS:

```
export AWS_ACCESS_KEY_ID="XXXXXXXXXX";
export AWS_SECRET_ACCESS_KEY="XXXXXXX/XXXXXX";
export AWS_BUCKET_URL="XXXXXXXXXX";
export AWS_REGION="country-region-number";
```

If you are using Azure:

```
export AZURE_STORAGE_ACCOUNT_NAME="myStorageAccountName"
export AZURE_STORAGE_CONTAINER_NAME="ContainerName"
export AZURE_STORAGE_ACCOUNT_ACCESS_KEY="AccountKey"
```

### Running the application

1.  Open you computer terminal and navigate to the project directory
2.  Do `source env.sh` to load all the variables in the env.sh file in the terminal
3.  Do `npm install` (This only has to be done on the first time to install all the required node modules)
4.  Do `npm run frontend` in one terminal window
5.  Do `npm run backend` in another terminal window

### Technology stack

*   `React` frontend JavaScript framework
*   `Redux` centralized frontend state management
*   `Bootstrap` frontend CSS/JavaScript styling framework
*   `Node` backend JavaScript
*   `MongoDB` no-SQL database
*   `Mongoose` database client for JavaScript/Node
*   `AWS S3` image hosting
*   `Heroku` hosting provider
*   `Sendgrid` email service

```

```
