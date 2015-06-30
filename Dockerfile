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

# Bundle app source
COPY ./dist /dist
WORKDIR "/dist"

# Install app dependencies
RUN npm install --production

ENV NODE_ENV production
ENV PORT 8081

# This mongodb will be entered in the hosts file by the compose links:
ENV MONGOLAB_URI mongodb://mongodb/formerfun

EXPOSE 80

CMD ["node", "./server/app.js"]

#######################
########  END  ########
#######################




# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

