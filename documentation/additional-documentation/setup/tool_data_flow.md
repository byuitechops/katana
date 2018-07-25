# Tool Data Flow
The purpose of this document is to describe the general data flow of a typical Katana tool.

## Login
Stuff here

## Home Page
1. The Angular Service, 'toolService', makes a call to the server, which returns a list of tools that are available to the user. (Angular -> Server -> Angular)
2. The Home Page is populated using the returned list of tools and the 'categories' object array on 'toolService'. (Angular)
3. The user selects a tool. (Angular)
4. The selected tool's settings object is exported and is then made accessible through the 'toolService' as 'selectedTool'. (Angular)
5. The Options Page is then loaded. (Angular)

## Options Page
1. The Options Page is created with the information on 'selectedTool'. (Angular)
2. The user fills out the generated form and clicks 'Run Tool'. (Angular)
3. The form results are stored on the 'toolService'. NEED TO SAY WHERE THEY ARE STORED (Angular)

## Tool View Discover
1. For each selected course, the tool ID, results from the form, and the course info, are sent to the server. (Angular -> Server)
2. The server uses the tool ID to send the info to the correct tool in node_tools.js. (Server)
3. The info is then sent from node_tools.js to the NodeTool.js class instance for that tool. (Server)
4. The info is then sent from NodeTool.js to the specific tool's `.js` file where the `discover` function is run. (Server)
5. After running the `discover` function, the issueItems are returned from NodeTool.js to node_tools.js. (Server)
6. The issueItems are then returned from node_tools.js to the server. (Server)
7. The server then sends the issueItems to the Angular Client which will populate the Tool View page with the issueItems. (Server -> Angular)

## Tool View Fix 
This section is only applicable if 'toolType' === 'fix' on the tool's exported settings object.
1. In the Tool View, the user filles out any options on the issue cards, and sets the status of the issues, typically to 'approved' or 'skipped'. NEED TO SAY WHERE THE ISSUES ARE BEING STORED/UPDATED ON THE ANGULAR SIDE (Angular)
2. The user clicks 'Fix Approved Issues' and continues through the modal. (Angular)
3. For each course, the tool ID, course info, and the issueItems with their option values, are sent to the server. (Angular -> Server)
4. The server uses the tool ID to send the info to the correct tool in node_tools.js. (Server)
5. The info is then sent from node_tools.js to the NodeTool.js class instance for that tool. (Server)
6. The info is then sent from NodeTool.js to the specific tool's `.js` file where the `fix` function is run. (Server)
7. After running the `fix` function, the issueItems are returned from NodeTool.js to node_tools.js. (Server)
8. The issueItems are then returned from node_tools.js to the server. (Server)
9. The server then sends the issueItems to the Angular Client which will populate the Tool View page with the issueItems and their updated statuses. (Server -> Angular)