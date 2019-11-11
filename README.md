# Hack-CBS

## Idea
A mobile app to track a user's medical history. The solution is versatile so that it can be used by any doctor, any patient, any medical
insurance company pan India, while keeping in mind their access scopes that are different. To make this solution more interesting RFID cards
can be used to generate a unique medical identity for each patient which when swiped, the person will be able to view the patient's
medical history.

## Implementation
Two apps namely the patient app and the doctor/insurance company app were built using a Flutter. A database built on PostgreSQL took care of
all the required features, constraints and access scope restrictions. Due to the unavailability of RFID cards, cards having NFC tags were
used as a unique identity card.

Patient App | Admin App
--- | ---
![alt-text](https://github.com/CheshtaK/Hack-CBS/blob/master/patient_app/patient_app.gif)    |  ![alt-text](https://github.com/CheshtaK/Hack-CBS/blob/master/admin_app/admin_app.gif) 
