FROM node:16
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV MODEL_URL='https://storage.googleapis.com/mlgc-bucket-ayumi/model-in-prod/model.json'

CMD [ "npm", "start" ]

EXPOSE 8080