FROM node:8.12.0

WORKDIR /usr/src/smart-brain-v2

COPY ./ ./

RUN npm install
CMD ["/bin/bash"]
