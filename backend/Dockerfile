# pull official base image
FROM python:3.11-slim

# set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.5.1 \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    PIP_NO_CACHE_DIR=off \
    PIP_DEFAULT_TIMEOUT=100 \
    WORKDIR=/app

# set work directory
WORKDIR ${WORKDIR}
ENV PATH="$WORKDIR/.venv/bin:$PATH"
RUN mkdir -p /app/static
RUN mkdir -p /app/storage

# install dependencies
RUN apt-get update && apt-get install -y curl
RUN pip install "poetry==$POETRY_VERSION"
COPY poetry.lock pyproject.toml /app/

RUN poetry config installer.max-workers 10
RUN poetry install --no-interaction --no-ansi -vvv

# copy project
COPY . .
