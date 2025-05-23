FROM node:18-alpine

WORKDIR /app

# Optional: cài serve
RUN npm i -g serve

# Copy thư mục dist (chỉ file build)
COPY dist/ ./dist

# Serve build ở port 3002
EXPOSE 3001
CMD [ "serve", "-s", "dist", "-l", "3002" ]
