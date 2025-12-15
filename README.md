# EVcharging Simulator

Examensarbete (YH MU24) – en webbaserad simulator för köer och laddning vid elbilsladdstationer.  
Backend: Spring Boot + MySQL. Frontend: React.  

> OBS: README uppdateras när projektet är färdigt.


# POSTMAN

To POST register a new user(auth/register):
{
  "name": "Jane Doe"
  "email": "Jane@email.com",
  "password": "yourPassword"
}

To POST a car logged in as a user (/vehicles):
{
  "brand": "Tesla",
  "model": "Model 3",
  "plateNumber": "ABC123",
  "batterySizeKWh": 60
}
