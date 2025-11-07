README – Loadsmart Technical Test (Drivers, Trucks, Assignments)
Overview
This project is a web API to manage drivers, trucks, and daily assignments. It’s built with Django and Django REST Framework (DRF).

Business rules:

A driver can be assigned to at most one truck per day.
A truck can be assigned to at most one driver per day.
The driver’s license must meet or exceed the truck’s minimum required license type.
List endpoints support filtering, ordering, and pagination.
Apps:

drivers: CRUD for drivers.
trucks: CRUD for trucks.
assignments: CRUD for assignments with business validations.
Requirements
Python 3.10+
pip
Virtual environment tool (venv)
SQLite (default, no setup required)
Getting Started
Clone the repository
git clone
cd backend
Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate (Linux/Mac)
.venv\Scripts\activate (Windows)
Install dependencies
pip install -r requirements.txt
Apply migrations
python manage.py migrate
Create a superuser (optional, for Django Admin)
python manage.py createsuperuser
Run the server
python manage.py runserver
Base URL: http://localhost:8000
DRF Settings (configured)
Pagination: PageNumberPagination with page_size override enabled and MAX_PAGE_SIZE set.
Filtering and ordering: enabled via django_filters and OrderingFilter.
Key settings:

DEFAULT_PAGINATION_CLASS = rest_framework.pagination.PageNumberPagination
PAGE_SIZE = 10
PAGE_SIZE_QUERY_PARAM = "page_size"
MAX_PAGE_SIZE = 100
DEFAULT_FILTER_BACKENDS = [OrderingFilter, DjangoFilterBackend]
Data Model Summary
Drivers

name: required string
license_type: one of A/B/C/D/E
Trucks

plate: unique string validated via regex (Brazilian-like plate format)
model: string
year: integer
minimum_license_type: one of A/B/C/D/E
Assignments

driver: FK to Driver
truck: FK to Truck
date: date
Validations:
Unique driver per date
Unique truck per date
driver.license_type >= truck.minimum_license_type
Note: assignment validations are implemented in the serializer, and support partial updates (PATCH) by falling back to instance fields when a field is omitted.

API Endpoints
Base: http://localhost:8000/api/

Drivers

GET /drivers/
POST /drivers/
GET /drivers/{id}/
PATCH /drivers/{id}/
DELETE /drivers/{id}/
Example create:

POST /api/drivers/
Body: {"name": "Alice", "license_type": "D"}
Trucks

GET /trucks/
POST /trucks/
GET /trucks/{id}/
PATCH /trucks/{id}/
DELETE /trucks/{id}/
Example create:

POST /api/trucks/
Body: {"plate": "ABC1D23", "model": "Volvo FH", "year": 2020, "minimum_license_type": "C"}
Assignments

GET /assignments/
POST /assignments/
GET /assignments/{id}/
PATCH /assignments/{id}/
DELETE /assignments/{id}/
Example create:

POST /api/assignments/
Body: {"driver": 1, "truck": 2, "date": "2025-11-10"}
Common validation errors:

400 Driver license 'C' is insufficient for truck requiring 'D'.
400 This driver is already assigned on this date.
400 This truck is already assigned on this date.
Filtering, ordering, pagination

Filters: driver, truck, date
/api/assignments/?driver=1
/api/assignments/?truck=2
/api/assignments/?date=2025-11-10
Ordering: date, id
/api/assignments/?ordering=date
/api/assignments/?ordering=-date
Pagination:
/api/assignments/?page=1&page_size=5
Response includes: count, next, previous, results
Django Admin
URL: http://localhost:8000/admin
Sections: Drivers, Trucks, Assignments
Recommended admin config:
Drivers: list_display = ("name", "license_type")
Trucks: list_display = ("plate", "model", "year", "minimum_license_type"); search_fields = ("plate", "model")
Assignments: list_display = ("driver", "truck", "date"); list_filter = ("date", "driver", "truck")
Running Tests
Run all tests:
python manage.py test
Coverage highlights:

assignments/tests: creation, driver/truck-per-day conflicts, insufficient license, partial PATCH (valid/invalid), filters and ordering.
drivers/tests: valid create, invalid license_type, required name, list/detail.
trucks/tests: valid create, invalid plate, invalid minimum_license_type, unique plate, list/detail.
Expected: all tests pass.

Code Style and Quality
Formatting and imports: Black and isort
Optional lint: Ruff
VS Code and pyproject.toml configured for consistency
Optional pre-commit hooks to enforce style/lint on commit
Development Workflow
Use feature branches per app/feature
Clear commit messages (feat, fix, test, refactor)
PRs with concise descriptions (business rules implemented, endpoints affected, tests added)
Optional Next Steps
Minimal React frontend
Screens for Drivers, Trucks, Assignments
Create/edit/delete assignments, filters, and pagination
Display backend validation errors in forms
Demo fixtures
Export: python manage.py dumpdata drivers trucks --indent 2 > fixtures/sample_data.json
Import: python manage.py loaddata fixtures/sample_data.json
CI (GitHub Actions): install deps, migrate, and run tests on every push/PR
