## Code Browser

### About

Code Browser is a system to show visual information about open source repositories
and code. It aims to be a browser extension that sends information to a backend system,
which will generate statistics about the current site being visited. Current supported
sites is Github, but it is very easy to extend by adding support to other sites.
The visualizations use OpenedEyes and D3.js libraries. On the backend, Git itself and Analizo are
used to generate data. It uses caching at all stages in order to improve performance.
This work is not complete yet, but it works for academic purposes and as a proof-of-concept.

### How to run the backend

* Go to `backend` directory
* Run `bundle install` to install missing gems
* Edit config/database.yml to configure you database
* Run `rake db:migrate` to create the tables in the database
* Start the server: `rails s`
* Start the daemon of background jobs: `rake jobs:work`

### How to run the frontend

Install the Google Chrome extension that lives on `frontend` directory.

### Example

Showing information about a repository, using Analizo to generate data and OpenedEyes for visualization: http://homes.dcc.ufba.br/~caiosba/mestrado/code-browser-1.png.

### Credits

Caio SBA <caiosba@gmail.com>, 2013. Developed as a work for the
master lecture Topics on Software Engineering, by Prof. Manoel Mendonça, at
Federal University of Bahia - Brazil.
