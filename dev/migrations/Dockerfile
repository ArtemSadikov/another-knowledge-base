FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY db db

CMD ["npm", "run", "migrate"]
