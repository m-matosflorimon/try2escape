FROM node

ADD . /app

WORKDIR /app

RUN npm install

EXPOSE 8000

CMD ["node","app.js"]