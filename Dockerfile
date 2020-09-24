FROM node:12.18.4-alpine3.10
WORKDIR front/
COPY build ./build/
EXPOSE 3000
CMD ["npm", "start"]