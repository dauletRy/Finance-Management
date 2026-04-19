# FineBank — Personal Finance Management App

A full-stack personal finance tracker built with Django REST Framework and Angular 17.

## Group Members
- Niyazbergenov Azamat
- Ryskul Daulet
- Zinatov Ruslan

## Tech Stack
- **Backend:** Django 5.2, Django REST Framework, SimpleJWT, django-cors-headers, ReportLab
- **Frontend:** Angular 17, Tailwind CSS, Chart.js
- **Database:** SQLite

## Project Structure

```
Finance-Management/project/
├── finebank_backend/
│   ├── backend/          # settings, urls
│   └── finance/          # models, views, serializers, urls
└── finebank-frontend/
    └── src/app/
        ├── components/   # login, overview, cards, transactions, sidebar
        ├── guards/        # auth.guard.ts
        ├── interceptors/  # jwt.interceptor.ts
        ├── models/        # finance.models.ts
        └── services/      # auth.service.ts, finance.service.ts
```
## Backend Setup
```bash
cd finebank_backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Frontend Setup
```bash
cd finebank-frontend
npm install
ng serve
```

## URLs
- Frontend: http://localhost:4200
- Backend: http://localhost:8000

## Demo Credentials
- Username: `admin`
- Password: `admin123`

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login/ | JWT login |
| POST | /api/logout/ | Logout |
| GET | /api/dashboard/ | Dashboard stats |
| GET | /api/weekly-stats/ | Weekly income/expense stats |
| GET/POST | /api/cards/ | List / create cards |
| DELETE | /api/cards/<id>/ | Delete card |
| GET/POST | /api/transactions/ | List / create transactions |
| GET/PUT/DELETE | /api/transactions/<id>/ | Transaction detail |
| GET | /api/categories/ | List categories |
| GET | /api/export-csv/ | Export transactions as CSV |

## Requirements Coverage

### Backend
- 4 models: Category, Card, Transaction, User
- Custom model manager: TransactionManager (get_weekly_stats)
- 3 ForeignKey relationships
- 5 FBVs: login, logout, dashboard, export_csv, weekly_stats
- 5 CBVs: CardListCreate, CardDetail, TransactionListCreate, TransactionDetail, CategoryList
- Full CRUD on Transaction
- JWT authentication via SimpleJWT
- CORS configured for localhost:4200

### Frontend
- TypeScript interfaces for all models
- 2 services with HttpClient: AuthService, FinanceService
- JWT interceptor + authGuard
- 4 named routes: login, overview, cards, transactions
- 7+ click events triggering API calls
- 8+ [(ngModel)] form controls
- @for and @if used throughout
- Inline error/success messages on all API calls
