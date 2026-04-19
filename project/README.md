# FineBank Project
FineBank.io – Full-Stack Finance Management App
Project Concept: A personal finance tracker with virtual cards, transaction history, smart categorization, budget alerts, charts, and export.
The UI matches the described photo layout: left sidebar navigation, central dashboard (Overview) with total balance + card carousel + chart + history list, right/bottom operations panel for quick transaction entry.


## Group Members
Niyazbergenov Azamat
Ryskul Daulet
Zinatov Ruslan

## Backend (Django)
cd finebank_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

## Frontend (Angular)
cd finebank-frontend
npm install
ng serve

## URLs
Frontend: http://localhost:4200
Backend: http://localhost:8000