# Example curl flows

# 1) Signup
curl -X POST http://localhost:4000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Admin","email":"admin@example.com","password":"password"}' -c cookies.txt

# Response sets refreshToken cookie in cookie jar (cookies.txt), and returns accessToken in JSON.

# 2) Login (if already created)
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password"}' -c cookies.txt

# 3) Create a project (use access token from login response)
curl -X POST http://localhost:4000/api/projects -H "Content-Type: application/json" -H "Authorization: Bearer ACCESS_TOKEN_HERE" -d '{"name":"Demo Project","description":"test","members":[]}'

# 4) Create task in project (replace PROJECT_ID and ACCESS_TOKEN)
curl -X POST "http://localhost:4000/api/projects/PROJECT_ID/tasks" -H "Content-Type: application/json" -H "Authorization: Bearer ACCESS_TOKEN_HERE" -d '{"title":"First task","description":"test task"}'
