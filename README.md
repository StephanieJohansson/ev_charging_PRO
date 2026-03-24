# EVcharging Simulator

Examensarbete (YH MU24) – en webbaserad simulator för köer och laddning vid elbilsladdstationer.  
Backend: Spring Boot + MySQL. Frontend: React.  

> OBS: README uppdateras när projektet är färdigt.
>
> [![Backend CI](https://github.com/StephanieJohansson/ev_charging_PRO/actions/workflows/backend.yml/badge.svg)](https://github.com/StephanieJohansson/ev_charging_PRO/actions/workflows/backend.yml)
> [![Frontend CI](https://github.com/StephanieJohansson/ev_charging_PRO/actions/workflows/frontend.yml/badge.svg)](https://github.com/StephanieJohansson/ev_charging_PRO/actions/workflows/frontend.yml)


# POSTMAN

To POST login as admin(/auth/login):

{
  "email": "admin@mail.com",
  "password": "admin123"
}


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
