# chatNodeJS

**chatNodeJS** is a small client-server application for NodeJS.

- the client side is an HTML page using **HTML 5**, **JavaScript 6** and **jQuery 3**.
- the server side is a JavaScript 6 application written for **NodeJS**
- several clients can connect at the same time to the server
- when one client posts a message,it is displayed in the server console AND to every other connected client
- the message is dispatched to all browsers using **SSE** (Server-Side Events), a new communication protocol used to send events from the server to the clients.
- similarly, it is possible to write messages in the server console that will be dispatched to all connected clients

Start the application (_npm start_) in the chatNodeJS folder, open your browser and use the URL _http://localhost:8080/_

**Caveat**: this application will not work with **MS IE** or **MS Edge**, as it does not support **SSE**  (sigh...) 