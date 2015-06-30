###################################################
#
# Use phusion/passenger-full as base image.
#
###################################################


FROM phusion/passenger-full:0.9.15
#FROM phusion/passenger-nodejs:latest

# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]



#######################
######## START ########
#######################

# disable nginx disabler
RUN rm -f /etc/service/nginx/down

RUN rm /etc/nginx/sites-enabled/default
ADD ./webapp.conf /etc/nginx/sites-enabled/webapp.conf
RUN mkdir /home/app/webapp





COPY ./dist /home/app/webapp
WORKDIR "/home/app/webapp"

# Install app dependencies
RUN npm install --production

ENV NODE_ENV production
ENV PORT 8080
ENV IP 127.0.0.1
ENV MONGOLAB_URI mongodb://mongodb/formerfun


# Bundle app source
#COPY ./dist /dist
#WORKDIR "/dist"


CMD ["node", "./server/app.js"]

#######################
########  END  ########
#######################




# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

