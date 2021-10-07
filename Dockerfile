FROM node:latest as build-stage 
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build


FROM nginx:1.21 as Production
WORKDIR /app
COPY --from=build-stage /app/build /app
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf