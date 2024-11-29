# Travel Planner Web Application 

## Group info: COMP S381F Group 8 

  |     Student Name: <sub>`** for our group leader`</sub>  |   Student ID  |
  | :---: | :---: |
  | <sup>**</sup> Ng Man Hei | 13505304      |  
  | Tse Man Hin   | 13515463      |
  | Wong Sin Ngai | 13588511      |
  | Pau Ka Lok    | 13068093      |
  | Leung Aidan   | 13626010      |

## Project file info: 

<details>
   <summary> Summary of functionalities of our web provided Server.js </summary>
  
  ## User Authentication
  * Registration
  * Login
  * Log out
  * Profile Management

  ## Trip Management
  * Edit Trips
  * Delete Trips
  * View My Trips

  ## Contact Form
  * Contact us

  ## Budget Calculator
  * Calculate the total spends of the trip
  * Generate the pie chart for download

  ## Trip Planner
  * Create Trips
     
</details>

<details>
  <summary> Package.json Dependencies: </summary>
  
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

</details>

<details>
  <summary> Public </summary>

  ## Folder
  For public folder , we have " main.js "  in JavaScript files, and " style.css " in CSS files.

  In main.js, we add the smooth scrolling is to  enhance the user experience on a webpage by enabling smooth scrolling for anchor links.The Form validation used to Prevent Default Submission and show the error message.The Card hover Effect show when the size of web page change, still show diiferent buuton in the web.
</details>

<details>
  <summary> Views Folder Structure</summary>

  ## Subfolders  
  ### `admin/`
  - **`contacts.ejs`**  
    Displays the list of user inquiries or contact requests.
  
  ### `partials/`
  - **`footer.ejs`**  
    Defines the footer layout shared across multiple pages.
  - **`header.ejs`**  
    Defines the header layout with navigation and branding.
  - **`messages.ejs`**  
    Displays flash messages for user feedback (e.g., errors or success).
  
  ### `trips/`
  - **`edit.ejs`**  
    A form to edit an existing trip's details.
  - **`new.ejs`**  
    A form to create a new trip.
  
  ## Main `.ejs` Files
  - **`about.ejs`**  
    Provides information about the application or company.
  - **`add-trip.ejs`**  
    A form to add a new trip.
  - **`budget-calculator.ejs`**  
    A tool for users to calculate trip budgets.
  - **`contact.ejs`**  
    A page with a contact form for user inquiries.
  - **`dashboard.ejs`**  
    Displays an overview of the user's activities or stats.
  - **`footer.ejs`**  
    (Used in `partials/`) Shared footer for all pages.
  - **`header.ejs`**  
    (Used in `partials/`) Shared header for all pages.
  - **`index.ejs`**  
    The main landing page of the application.
  - **`layout.ejs`**  
    The base layout template wrapping individual pages.
  - **`login.ejs`**  
    A login form for user authentication.
  - **`my-trips.ejs`**  
    Displays a list of trips created by the user.
  - **`profile.ejs`**  
    Displays and edits user profile details.
  - **`register.ejs`**  
    A form for user registration.
  - **`setting.ejs`**  
    Manages user-specific settings or preferences.
  - **`settings.ejs`**  
    Handles application-wide settings or configurations.
  - **`trip-planner.ejs`**  
    Provides a form or interface for planning trips.
  - **`trips.ejs`**  
    Displays a list of trips available to explore.
  - **`updateProfile.ejs`**  
    A form to update user profile information.
</details>

<details>
  <summary> Models </summary>
  
  ## **Models**
  For models file , we have "Contact.js ", "Trip.js " , "User.js " in JavaScript file .

  ### Contact.js
  The Contact.js model is used to manage and store user-submitted contact form data. This model contains fields like the user's name, email, subject, and message. It ensures that each contact submission is captured and stored in the database for future reference or follow-up.

  ### Fields:

  name: The name of the person submitting the contact form.
  email: The email address of the person.
  subject: The subject of the message.
  message: The body of the contact message.

----

  ### Trip.js
  The Trip.js model handles all information related to the trips managed by users in the application. It allows users to create, view, edit, and delete trips. The model contains fields that store trip-related details such as destination, start date, end date, description, and the user associated with the trip.

  ### Fields:

  destination: The destination of the trip.
  startDate: The start date of the trip.
  endDate: The end date of the trip.
  description: A brief description or additional details about the trip.
  user: A reference to the user who created the trip (linked to the User.js model).

----

  ### User.js
  The User.js model is used to handle user authentication and profile data. It stores user credentials (email, password), and any additional user-related information like their profile details. This model also manages user roles (e.g., admin, regular user) and links the user to their trips.

  ### Fields:

  email: The email address of the user (used for login).
  password: The password of the user (hashed using bcrypt for security).
  name: The user's name.
</details>

<details>
  <summary> Routes </summary>
  
  ## **User Management API**
  This project provides a RESTful API for managing `User` resources using **Express.js** and **MongoDB**. It supports basic CRUD operations and uses **Mongoose** for database interactions.

  ## **Description**
  This API allows you to:

  1. **Get all users**: Fetch all users in the database.
  2. **Get a specific user by ID**: Retrieve details of a specific user using their unique identifier.
  3. **Create a new user**: Add a new user to the database with fields like `name`, `email`, and `password`.
  4. **Update an existing user**: Modify specific fields of an existing user.
  5. **Delete a user**: Remove a user from the database by their ID.
  
  The API also includes middleware (`getUser`) to fetch and validate a user for PATCH and DELETE operations.

  ## **Features**
  - **GET `/users`**: Fetch all users.
  - **GET `/users/:id`**: Retrieve a user by their unique ID.
  - **POST `/users`**: Create a new user with name, email, and password.
  - **PATCH `/users/:id`**: Update specific fields of a user (e.g., name, email, or password).
  - **DELETE `/users/:id`**: Delete a user by their ID.
</details>

## Cloud-based server URL: 
https://hkmu381-travel-planner-app.onrender.com

## Operation guides

> [!NOTE]
> After go in the web: Home -> Register -> Login

<details>
  <summary> The use of Login logout pages </summary>
  
  <br>
  
  > User can go to the register site to make their own account, then will jump to the login page and then can login, and for the logout pages is the profile page, in there you can update you profile or you can logout the account.

  1. Installation guideline
  2. Open Visual Studio Code
  3. Create .env file
  4. Copy the code in env sample and modify the "SESSION SECRET" and "MONGODB_URL"
  5. Makesure u install nodejs
  6. Download npm install, "npm run dev"
  7.  Terminal will display: 
   
  ```
     server is running on port 3001
     Connected to MongoDB
     MongoDB Atlas Connected
     Database ping Check Connection successful
  ```
</details>

<details>
  <summary> CRUD Web Page (UI/Buttons) </summary>

  ## Create
   1. Dashboard
   2. Register New Account
   3. Add New Trip
  
  ## Read
  1. Enter Destination
  2. Start Date
  3. End Date
  4. Description
  5. Create Trip
  
  ## Update
  ( **Update Profile** )
   1. Update Name
   2. Update Email
   3. Update Password
  
  ## Delete
  1. Delete Account
  2. Delete Trip
     
  ## Registration Part
  1. Users visit the **Registration Page** to create their own account.
  2. After successfully registering, users are redirected to the **Login Page**.
  
  ## Login Part
  1. On the **Login Page**, users enter their credentials (username/email and password) to log in.
  
  ## Profile Page
  1. Once logged in, users can navigate to the **Profile Page**.
  2. On the Profile Page, users have the following options:
      **Update Profile:** Modify their profile information.
      **Logout:** Log out of their account.
</details>

<details>
  <summary> Restful CRUD COMMAND </summary>
  
  ## CREATE
  ```
  curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
  }'
  ```

  ## READ
  ```
  // Get all users
  curl http://localhost:3001/users
  ```
  ```
  # Get specific user by ID
  curl http://localhost:3001/users/{input the userid u want to find here}
  ```

  ## UPDATE
  ```
  // Update single field
  curl -X PATCH http://localhost:3001/users/{input the userid u want to find here} \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'
  ```
  ```
  // Update multiple fields
  curl -X PATCH http://localhost:3001/users/{input the userid u want to find here} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "email": "newemail@example.com"
  }'
  ```

  ## DELETE
  ```
  // Delete user
  curl -X DELETE http://localhost:3001/users/{input the userid u want to find here}
  ```
      
</details>
