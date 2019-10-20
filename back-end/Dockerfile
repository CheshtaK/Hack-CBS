FROM mhart/alpine-node:9
RUN mkdir back-end/
WORKDIR back-end/
ADD . .
RUN npm install && npm run build
CMD npm run dev