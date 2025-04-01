# VibeNest Backend

Backend API for the VibeNest social media platform.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=your_frontend_url
   NODE_ENV=development
   ```

3. Run the server:
   ```
   npm start
   ```

4. For development with auto-reload:
   ```
   npm run dev
   ```

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Name: vibenest-api
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Auto-Deploy: Yes

4. Add the following environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `FRONTEND_URL`: URL of your frontend application
   - `NODE_ENV`: production

5. Create a persistent disk for uploads:
   - Mount Path: `/opt/render/project/src/uploads`
   - Size: 1 GB (or as needed)

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search for users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/follow/:id` - Follow/unfollow a user
- `GET /api/users/:id/followers` - Get user followers
- `GET /api/users/:id/following` - Get user following
- `GET /api/users/suggested` - Get suggested users
- `PUT /api/users/privacy` - Update privacy settings
- `GET /api/users/saved` - Get saved posts
- `PUT /api/users/password` - Change password

### Posts
- `POST /api/posts` - Create a post
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id/like` - Like a post
- `PUT /api/posts/:id/unlike` - Unlike a post
- `PUT /api/posts/:id/bookmark` - Bookmark a post
- `PUT /api/posts/:id/unbookmark` - Remove bookmark
- `DELETE /api/posts/:id` - Delete a post

### Comments
- `POST /api/posts/:postId/comments` - Add a comment
- `GET /api/posts/:postId/comments` - Get post comments
- `PUT /api/comments/:commentId/like` - Like a comment
- `PUT /api/comments/:commentId/unlike` - Unlike a comment
- `POST /api/comments/:commentId/replies` - Add a reply
- `GET /api/comments/:commentId/replies` - Get comment replies

### Stories
- `POST /api/stories` - Create a story
- `GET /api/stories` - Get stories
- `GET /api/stories/user/:userId` - Get user stories
- `PUT /api/stories/:storyId/seen` - Mark story as seen
- `DELETE /api/stories/:storyId` - Delete a story

### Chat
- `POST /api/chat` - Access or create a chat
- `GET /api/chat` - Get user chats
- `POST /api/chat/group` - Create a group chat
- `PUT /api/chat/rename` - Rename a group
- `PUT /api/chat/groupadd` - Add user to group
- `PUT /api/chat/groupremove` - Remove user from group

### Messages
- `POST /api/message` - Send a message
- `GET /api/message/:chatId` - Get chat messages
