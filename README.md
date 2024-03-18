## Backend for Movie Search Website

### Instructions

Follow these instructions to run the server:

- Clone the repository using the following command:
    ```sh
    git clone https://github.com/OpenSoft-2024/Backend.git
    ```
- Install the required packages:
    ```sh
    npm install --save
    ```
- Create a `.env` file similar to `.env.example` file and source it:
    ```sh
    Linux/Mac: export $(grep -v '^#' .env | xargs) 
    Windows: Not Required to run any command
    ```
- Start the server with the following command:
    ```sh
    npm run server
    ```

**Note**: The server runs in port 8080


## TODO: [Immediate]
- Authentication: : Abhishek , nishant
    - Add Oauth in authentication (Google + Facebook) 
    - Delete User + Profile Delete

- Movie Model : Pavan ,Atul 
    - Schema ==> See sample_mflix database
    - API list ==> CRUD
        - Create
        - Read - [/search, getByID, /languages, /genre, /alltimehits, /latest]
        - Update - [Rating Changes + Any Change (Admin Only)]
        - Delete - [Delete All movie related data]

- Landing Page APIs: (Under Movie Model)
    - If Login:
        - Personalised Recommendations
    - Else:
        - Latest Releases
        - Most Popular
            - By genre
            - By language (Later: By geo location)
        - All time hits 

- Authenticate every API using authMiddleware and then every on authenticated request:
  userId = req.userId 
  isAdmin = req.isAdmin
  Use this to authenticate if a user has permission to access this request 
- A sample on how this can be done is shown on the Reviews API routes 





