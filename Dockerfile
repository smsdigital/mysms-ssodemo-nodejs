FROM node:9

RUN mkdir -p /opt/app
WORKDIR /opt/app
ADD package.json /opt/app/
ADD package-lock.json /opt/app/
RUN npm install --production

ADD tsconfig.json /opt/app/
ADD bin /opt/app/bin
ADD src /opt/app/src

CMD ["npm", "run", "production"]
