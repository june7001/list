# Installation

## 1.Clone the repository:


git clone https://github.com/junescloud/list.git

## 2.Install dependencies:


cd server  
npm install  
cd ../client/list  
npm install

## 3.Set up environment variables:

Create a .env file in the root directory and a .env.local file in the client/list directory, then add the necessary variables.

### For the root .env:

DATABASE_URL='mysql://q5fgxxlt969saoxbwdy3:pscale_pw_UdE7uz7nkfbvymxbHlfQX7mBjWcF14slQrQTjWOGjhm@aws-eu-west-2.connect.psdb.cloud/list?ssl={"rejectUnauthorized":true}'      
JWT_SECRET="627D414AB7C6A1C4ED9A8AEC7E2F7"    
JWT_EXPIRATION="1h"  
COOKIE_SECRET="48DE396E4F95BDB789FBCDAADE8DF"

### For the client client/list/.env.local:

NEXT_PUBLIC_API_URL=http://localhost:3001  


# Usage

## 1.Start the server 
   
node server/src/index.js

## 2.Start the client

cd client/list     
npm run dev