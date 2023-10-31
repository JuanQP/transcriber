# Transcriber

## Run the project

```sh
docker compose up
```

That's it. App is online at http://localhost

You have a default user `admin` with password `admin`.

## Development

Services

```sh
docker compose up postgres rabbitmq
```

### Env files

You must copy and paste the `.env.sample` files that are inside `frontend` and `backend` folders.
With the default values you should be able to start developing.

```sh
cp frontend/.env.sample frontend/.env
cp backend/.env.sample backend/.env
```

### Backend

```sh
cd backend
poetry install
poetry run python manage.py runserver
poetry run celery -A proj worker -l INFO
```

### Frontend

```sh
cd frontend
npm install
npm run dev
```
