# Transcriber

## Run the project

👷 Work in progress...

## Development

Services

```sh
docker compose up postgres rabbitmq
```

Backend

```sh
cd backend
poetry install
poetry run python manage.py runserver
poetry run celery -A proj worker -l INFO
```
