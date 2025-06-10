# Use a lean NGINX base image
FROM nginx:alpine

# Copy the custom NGINX configuration
# This overwrites the default NGINX configuration
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default NGINX index.html
RUN rm -rf /usr/share/nginx/html/*

# Copy your frontend static files into the NGINX web root
# Ensure your index.html and script.js are in the 'frontend' directory relative to where you build this Dockerfile
COPY ./frontend/ /usr/share/nginx/html/

# Expose port 80, as NGINX listens on this port by default
EXPOSE 80

# Command to run NGINX in the foreground
# This is the default command for nginx:alpine, but it's good to be explicit
CMD ["nginx", "-g", "daemon off;"]
