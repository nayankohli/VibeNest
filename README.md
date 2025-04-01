# VibeNest Test Suite

This repository contains a comprehensive test suite for the VibeNest social media application. The tests cover both the backend and frontend components of the application.

## Test Structure

The test suite is organized as follows:

### Backend Tests

- **Unit Tests**: Test individual components in isolation
  - User Authentication
  - User Controllers
  - Post Controllers
  - Comment Controllers
  - Story Controllers
  - Chat Controllers

- **Integration Tests**: Test the interaction between components
  - User Authentication Flow
  - API Endpoints

### Frontend Tests

- **Unit Tests**: Test individual React components
  - Login Component
  - Register Component
  - Post Component
  - User Actions
  - User Reducers

- **Integration Tests**: Test user flows
  - Registration and Login Flow
  - Protected Routes

## Running the Tests

### Backend Tests

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Run the tests:
   ```
   npm test
   ```

4. Run tests with coverage:
   ```
   npm run test:coverage
   ```

5. Run tests in watch mode:
   ```
   npm run test:watch
   ```

### Frontend Tests

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Run the tests:
   ```
   npm test
   ```

4. Run tests with coverage:
   ```
   npm test -- --coverage
   ```

5. Run a specific test file:
   ```
   npm test -- src/tests/unit/components/Login.test.js
   ```

## Test Coverage

The test suite aims to provide comprehensive coverage of the application's functionality, including:

- User authentication and authorization
- User profile management
- Post creation, retrieval, and interaction
- Comment functionality
- Story creation and viewing
- Chat and messaging
- Frontend component rendering and behavior
- Redux state management
- API integration

## Adding New Tests

When adding new features to the application, it's important to also add corresponding tests. Follow these guidelines:

1. **Unit Tests**: Create tests for individual functions and components
2. **Integration Tests**: Create tests for interactions between components
3. **Test Edge Cases**: Include tests for error conditions and edge cases
4. **Mock External Dependencies**: Use Jest's mocking capabilities to isolate the code being tested

## Troubleshooting

If you encounter issues running the tests:

1. Make sure all dependencies are installed
2. Check that the test environment is properly configured
3. Verify that the MongoDB memory server is working correctly
4. Check for any syntax errors in the test files
5. Ensure that the component being tested is properly mocked or rendered

## Contributing

When contributing to the project, please ensure that your changes include appropriate tests. All pull requests should maintain or improve the current test coverage.
