FROM node:12.18.4-alpine3.10
WORKDIR /usr/src/toosa-finder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]