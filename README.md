## Backend for Movie Search Website

### Instructions

Follow these instructions to run the server:

- Clone the repository using the following command:
    ```sh
    git clone 
    ```
- Install the required packages:
    ```sh
    npm install --save
    ```
- Start the server with the following command:
    ```sh
    npm run server
    ```

**Note**: The server runs in port 5000


## TODO: [Immediate]
- Authentication: 
    - Add Oauth in authentication (Google + Facebook)
    - Add Role for Admin (should be secure)
    - Delete User + Profile Delete

- Profile
    - Schema
        - UserID
        - Image URL
        - History
        - Suggestions: Dynamic + Real-Time
        - Watchlist : Array[MovieObj]
        - Favorites
        - Subscription
        - Rentals: Array[MovieObj]
    - API list ==> CRUD
        - Create - [Profile create]
        - Read - [getbyUserID]
        - Update - 
        - Delete - [Favorites, Watchlist, History, Subscription, Account Deletion]

- Review Model
    - Schema ==> {UserID, Ratings, CommentID, MovieID}
    - API list ==> CRUD
        - Create
        - Read - [GetByMovieID, GetByUserID]
        - Update - [Ratings, Comments]
        - Delete - [DeleteByCommentID (Admin + User)]

- Movie Model
    - Schema ==> See sample_mflix database
    - API list ==> CRUD
        - Create
        - Read - [/search, getByID, /languages, /genre]
        - Update - [Rating Changes + Any Change (Admin Only)]
        - Delete - [Delete All movie related data]

- Landing Page APIs:
    - If Login:
        - Personalised Recommendations
    - Else:
        - Latest Releases
        - Most Popular
            - By genre
            - By language (Later: By geo location)
        - All time hits 






