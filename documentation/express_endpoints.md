# Database Structure

The endpoints for the Express server are:
<br/><br/> 
```
GET /
```
Serves the Angular app to the client.
<br/><br/> 
```
GET /tools/<tool>?<options>
```
Based on the tool and the provided options, discoveres issues in the course(s) and returns it to the client.
<br/><br/> 
```
PUT tools/<tool>?<options>
```
*Body*: List of approved issues to fix
Runs the respective tool on the provided list of approved issues, then returns the list of successfully fixed issues. Can be submitted as a POST request.
<br/><br/> 
