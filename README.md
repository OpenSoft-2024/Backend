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





# Movie API Routes


---

## Route: POST /create

**Description:** Create a new movie.

**Payload:**
```json
{
    "title": "Example Movie",
    "year": 2023,
    "runtime": 120,
    "released": "2023-03-28",
    "poster": "example_poster.jpg",
    "plot": "Example plot description",
    "fullplot": "Example full plot description",
    "lastupdated": "2023-03-28T12:00:00Z",
    "type": "movie",
    "directors": ["Director 1", "Director 2"],
    "writers": ["Writer 1", "Writer 2"],
    "awards": "Example awards",
    "imdb": {
        "id": "tt1234567",
        "rating": 7.5
    },
    "cast": ["Actor 1", "Actor 2"],
    "countries": ["USA", "UK"],
    "languages": ["English", "Spanish"],
    "genres": ["Action", "Adventure"],
    "tomatoes": {
        "viewer": {
            "rating": 8.0
        }
    },
    "num_mflix_comments": 100,
    "plot_embedding": "example_embedding"
}

```

## Route: GET /movie

**Description:** Fetch a movie by its title.

**Query Parameters:**
```json
{
    "title": "Example Movie"
}
```
## Route: PUT /movie

**Description:** Update a movie by its title.

**Payload:**
```json
{
    "title": "Example Movie",
    "genres": ["New Genre"]
}

```

## Route: GET /id/:id

**Description:** Fetch a movie by its id.

**Path Parameters:**
```json
{
    "id": "ExampleId"
}

```

## Route: GET /language

**Description:** Fetch a movie by its language.

**Query Parameters:**
```json
{
    "language": "Example Language"
}
```

## Route:  GET /genres

**Description:**  Get movies by genre.

**Query Parameters:**
```json
{
   "genre": "Action"
}
```
## Route: GET /gethits

**Description:** Fetch the number of hits for a specific movie.

**Query Parameters:**
```json
{
    "title": "Example Movie"
}
```
## Route: GET /latest

**Description:** Fetch the latest released movies.

**Query Parameters:** NONE

## Route: DELETE /:id


**Description:** Delete a movie by its ID.


**Path Parameters:**
```json
{
    "id": "ExampleId"
}

```
## Route: GET /update-language-and-genre-models

**Description:** Trigger an update for the language and genre models.

**Query Parameters:** NONE



---

# Payment API Routes


## Route: POST /checkout

**Description:** Create a new payment session.

**Headers:**
```json
{
    "Authorization": "Bearer token"
}
```
---
# Profile API Routes

## Route: GET /profile

**Description:** Fetch the profile of the current user.

**Headers:**
```json
{
    "Authorization": "Bearer token"
}
```
## Route: DELETE /profile

**Description:** Delete the profile of the current user.

**Headers:**
```json
{
    "Authorization": "Bearer token"
}
```
## Route: PUT /profile

**Description:** Update the profile of the current user.

**Headers:**
```json
{
    "Authorization": "Bearer token"
}
```
**Query Parameters:**
```json
{
    "name": "New Name",
    "email": "newemail@example.com"
}
```
---

# Rent API Routes

## Route: POST /rent

**Description:** Rent a movie.

**Headers:**
```json
{
    "Authorization": "Bearer token"
}
```
**Payload**
```json
{
    "movieId": "ExampleMovieId"
}
```

## Route: DELETE /rent

**Description:** Return a rented movie.

**Headers:**
```json
{
    "Authorization": "Bearer token"
}
```
**Payload**
```json
{
    "movieId": "ExampleMovieId"
}
```

## Route: GET /rent

**Description:** Get the rented movies of the current user.

**Headers:**
```json
{
    "Authorization": "Bearer token"
}
