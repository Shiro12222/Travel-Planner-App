# Travel Planner Web Application

## Group info: COMP S381F Group 8
  |     Student Name: <sub>`** for our group leader`</sub>  |   Student ID  |
  | :---: | :---: |
  | <sup>**</su> Ng Man Hei | 13505304      |  
  | Tse Man Hin   | 13515463      |
  | Wong Sin Ngai | 13588511      |
  | Pau Ka Lok    | 13068093      |
  | Leung Aidan   | 13626010      |

## Project file info: 
  ### Summary of functionalities of our web provided Server.js:
  
  1. User Authentication
      * Registration
      * Login
      * Log out
      * Profile Management
    
  3. Trip Management
      * Create Trips
      * Edit Trips
      * Delete Trips
      * View My Trips
      
  4. Contact Form
      * Contact us

  5. Budget Calculator

  6. Trip Planner

  7. Setting
      
  ### package.json Dependencies:
  
    "bcrypt": "^5.1.1",
    "bcryptjs": "^2.4.3",
    "bootstrap": "^5.3.2",
    "connect-flash": "^0.1.1",
    "cookie-session": "^2.0.0",
    "dotenv": "^16.4.5",
    "ejs": "^3.1.10",
    "express": "^4.21.1",
    "express-ejs-layouts": "^2.5.1",
    "express-session": "^1.18.1",
    "font-awesome": "^4.7.0",
    "mongodb": "^6.3.0",
    "mongoose": "^8.8.2",
    "passport": "^0.6.0",
    "passport-facebook": "^3.0.0",
    "passport-instagram": "^1.0.0",
    "passport-local": "^1.0.0",
    "path": "^0.12.7"

  ### public

  ### views

  ### models

## cloud-based server URL: https://hkmu381-grpprj.onrender.com/ 
## Operation guides

4. Operation guides (like a user flow) for your server

Installation guidline
open vs code
create .env file
copy the code in env sample and modify the SESSION SECRET AND MONGODB_URL

makesure u install nodejs

npm install
npm run dev

terminal will display
server is running on port 3001
Connected to MongoDB
MongoDB Atlas Connected
Database ping CHeck Connection successful


After go in the web:
-> Home
register
login

CRUD:
Dashboard
add new trip
enter destination
start date
end date
desciption
create trip

provide function
edit
delete
add new trip


- the use of Login/Logout pages: a list of valid login information, sign in steps? …
- the use of your CRUD web pages: which button or UI is used to implement create, read, update, and delete?
- the use your RESTful CRUD services: the lists of APIs? HTTP request types? Path URI? How to test them?
CURL testing commands?
Notes:
- `README.md` is important to let me know your project functions, which is crucial to marking the grade of
your project.
