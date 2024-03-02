# Pusers

## JSON PLACEHOLDER
This project uses on of the publicly available APIs, found [here](https://jsonplaceholder.typicode.com/).  
https://jsonplaceholder.typicode.com/users

The structure of a user looks like as below   
```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}
```

## Setting up locally
1. Clone this project from [GitHub](https://github.com/muremwa/ipsl-users).
```shell
git clone https://github.com/muremwa/ipsl-users
```
2. Navigate to the project
```shell
cd ipsl-users
```
2. Run `npm install`.
```shell
npm install
```
3. Run `ng serve`
```shell
ng serve
```

## Features
### USERS
- The home page features a list of users.
- Those without a company name are in red.
- Click the add user to open a modal with user details form.
- For search, once you submit the form in the top right, the app checks whether it's an email or normal name and filters accordingly.

### User details
- To view a user click on their name and you will navigate to their details page.

### To Note
- Since, the API does not support pagination, the list is cut into pieces to simulate pagination.
- Since all data contains company names, random entries are marked as empty to simulate.
