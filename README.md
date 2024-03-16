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
- Start the server with the following command:
    ```sh
    npm run server
    ```

**Note**: The server runs in port 5000


## TODO: [Immediate]
- Authentication: : Abhishek , nishant
    - Add Oauth in authentication (Google + Facebook) 
    - Add Role for Admin (should be secure)
    - Delete User + Profile Delete

- Profile : Bhaskar, Akshat
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

- Review Model : Vedic,Prafull
    - Schema ==> {UserID, Ratings, CommentID, MovieID}
    - API list ==> CRUD
        - Create
        - Read - [GetByMovieID, GetByUserID]
        - Update - [Ratings, Comments]
        - Delete - [DeleteByCommentID (Admin + User)]

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






