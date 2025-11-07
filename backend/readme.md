### README – Loadsmart Technical Test (Drivers, Trucks, Assignments)

#### Overview
This project is a Django + Django REST Framework (DRF) web API for managing drivers, trucks, and daily driver–truck assignments.

#### Business Rules
- A driver can be assigned to at most one truck per day.
- A truck can be assigned to at most one driver per day.
- A driver’s license must meet or exceed the truck’s minimum required license type.
- List endpoints support filtering, ordering, and pagination.

#### Apps
- `drivers`: CRUD for drivers.
- `trucks`: CRUD for trucks.
- `assignments`: CRUD for assignments with business validations.

---

### Requirements
- Python 3.10+
- pip
- Virtual environment tool (`venv`)
- SQLite (default; no setup required)

---
