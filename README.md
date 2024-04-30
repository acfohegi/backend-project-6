[![Actions Status](https://github.com/acfohegi/backend-project-6/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/acfohegi/backend-project-6/actions)
[![workflow](https://github.com/acfohegi/task-manager/actions/workflows/workflow.yml/badge.svg)](https://github.com/acfohegi/task-manager/actions/workflows/workflow.yml)

[![Maintainability](https://api.codeclimate.com/v1/badges/ddcdea6a93c7df3380e4/maintainability)](https://codeclimate.com/github/acfohegi/task-manager/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ddcdea6a93c7df3380e4/test_coverage)](https://codeclimate.com/github/acfohegi/task-manager/test_coverage)

# Description

task-manager is the final project of the ["Node.js Developer"](https://ru.hexlet.io/programs/backend) program on Hexlet. The main goal of the project was to provide hands-on experience in building a web application from scratch, with such stages as:
 - setting up CI
 - deploying to a cloud platform
 - working with database using an ORM
 - defining schema in migrations
 - separating concerns with the MVC pattern
 - integrating with an error monitoring system
 - crafting view templates with use of CSS framework

The new version is automatically deployed to Render (a PaaS provider) after successful building and testing stages in GH Actions. Uncaught errors in production are reported to Rollbar. In terms of features the project complies with requirements but some additional things are implemented like starting up within docker-compose.
