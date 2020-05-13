Folder description:

/bin
    Contains the entry point to run the server (www file). To start the server open /bin/www with node. Alternatively type "npm start" which is an alias for "node /bin/www" 

/node_modules
    Contains the node modules necessary for the server to run. To create this folder and install the modules run "npm install". This reads the modules specified as dependencies in package.json file.

/partials
    Contains header and footer partials. Partials are parts of a web page that are reused by many pages. Use of partials allows to put such parts in separate files and facilitates code reuse.

/public
    Contains images, JavaScript, CSS and other files used by the web page. Of particular interest is public/javascript/stockr.js which contains all the logic for the web page

/routes
    Contains express routers. Routers handle all requests made to the server. index.js handles all requests to the website, such as / and /query. api.js handles all requests to the REST api such as /api/stock, /api/stock/GOOG and /api/predict/GOOG.

/scripts
    Contains the python scripts for the project, namely stock_downloader.py which continuosly downloads stock prices and predict.py which handle future stock price prediction.

/views
    Contains the html for the website. 

app.js
    Express app code

database.js
    Contains the code the retrieves data from the database

package.json
    Specifies project metadata such as the app name and dependencies