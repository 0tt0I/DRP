# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.234.0/containers/alpine/.devcontainer/base.Dockerfile

ARG VARIANT="3.15"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-alpine-${VARIANT} AS devcontainer_base
RUN apk update \
    && apk add --no-cache nodejs npm

FROM alpine:latest AS base

# Baseline dependencies, node and npm used by everything
FROM base AS deps
RUN apk update && \
    apk add --no-cache nodejs npm

# Deployed api dependencies
FROM deps AS api_deps
COPY ./api/package* /workspace/api/
WORKDIR /workspace/api/
RUN npm ci --omit=dev

# Deployed app dependencies
FROM deps AS app_deps
COPY ./app/package* /workspace/app/
WORKDIR /workspace/app/
RUN npm ci --omit=dev

# Devcontainer with the installed dependencies
FROM devcontainer_base AS devcontainer
COPY --from=api_deps /workspace/api/node_modules /workspace/api/node_modules/
COPY --from=app_deps /workspace/app/node_modules /workspace/app/node_modules/

# Development api dependencies
FROM app_deps AS app_deps_all
RUN npm i

# Development app dependencies
FROM api_deps AS api_deps_all
RUN npm i

# Use next export to build de-hydrated html files
FROM app_deps_all AS app_builder
COPY ./app/pages /workspace/app/pages/
COPY ./app/services /workspace/app/services/
COPY ./app/public /workspace/app/public/
COPY ./app/styles /workspace/app/styles/
COPY ./app/tsconfig.json /workspace/app/
COPY ./app/.eslintrc.json /workspace/app/
RUN npm run build

# Transpile backend to javascript
FROM api_deps_all AS api_builder
COPY ./api/src /workspace/api/src
COPY ./api/tsconfig.json /workspace/api
RUN npm run build

# Standalone backend deployment
FROM api_deps AS api_local_deploy
WORKDIR /workspace/api
COPY --from=api_builder /workspace/api/dist/ /workspace/api/dist/
EXPOSE 3080
CMD ["npm", "run", "start"]

# Minimal local full-stack deployment with backend also acting as webserver
FROM api_deps AS fullstack_local_deploy
WORKDIR /workspace/api
COPY --from=api_builder /workspace/api/dist/ /workspace/api/dist/
COPY --from=app_builder /workspace/app/out/ /workspace/app/out
EXPOSE 3080
CMD ["npm", "run", "start"]

# TODO: Fullstack production deploy
