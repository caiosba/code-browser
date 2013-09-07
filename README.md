## Code Browser

### About

Code Browser is a system to show visual information about open source repositories
and code. It aims to be a browser extension that sends information to a backend system,
which will generate statistics about the current site being visited. Current supported
sites is Github, but it is very easy to extend by adding support to other sites.
The visualizations use OpenedEyes and D3.js libraries. On the backend, Git itself and Analizo are
used to generate data.

### How to run the backend

* Go to `backend` directory
* Run `bundle install` to install missing gems
* Edit config/database.yml to configure you database
* Run `rake db:migrate` to create the tables in the database
* Start the server: `rails s`
* Open http://localhost:3000 in your browser

### How to run the frontend

Install the Google Chrome extension that lives on `frontend` directory.

### Credits

Caio SBA <caiosba@gmail.com>, 2013. Developed as a work for the
master lecture Topics on Software Engineering, by Prof. Manoel Mendonça, at
Federal University of Bahia - Brazil.
