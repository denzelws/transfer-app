### README – Backend (Drivers, Trucks, Transfers)

#### Overview
This project is a Django + Django REST Framework (DRF) web API for Loadsmart Fleet Intelligence, managing drivers, trucks, and daily driver–truck transfers.

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
