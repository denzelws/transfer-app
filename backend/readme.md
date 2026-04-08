### README – Fleet Intelligence (Backend API)

#### Overview
This repository contains the backend API for Loadsmart Fleet Intelligence, built with Django and Django REST Framework (DRF). It manages the core data and business logic for drivers, trucks, and daily driver–truck transfers.

#### Business Rules
- A driver can be assigned to at most one truck transfer per day.
- A truck can be assigned to at most one driver transfer per day.
- A driver’s license must meet or exceed the truck’s minimum required license type.
- List endpoints support filtering, ordering, and pagination.

#### Apps
- `drivers`: CRUD for drivers.
- `trucks`: CRUD for trucks.
- `transfers`: CRUD for transfers with business validations.

---

### Requirements
- Python 3.10+
- pip
- Virtual environment tool (`venv`)
- SQLite (default database)

---
