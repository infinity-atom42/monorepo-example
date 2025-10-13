-- PostgreSQL initialization script for multiple databases
-- This script creates multiple databases for different services

-- Create database for web application
CREATE DATABASE server_example;
CREATE DATABASE auth_example;
CREATE DATABASE web_example;
CREATE DATABASE keycloak;
CREATE DATABASE openfga;

-- Create users for the databases
CREATE USER server_example WITH ENCRYPTED PASSWORD 'server_example_password';
CREATE USER auth_example   WITH ENCRYPTED PASSWORD 'auth_example_password';
CREATE USER web_example    WITH ENCRYPTED PASSWORD 'web_example_password';
CREATE USER keycloak       WITH ENCRYPTED PASSWORD 'keycloak_password';
CREATE USER openfga        WITH ENCRYPTED PASSWORD 'openfga_password';

-- Grant privileges to the users
GRANT ALL PRIVILEGES ON DATABASE server_example TO server_example;
GRANT ALL PRIVILEGES ON DATABASE auth_example   TO auth_example;
GRANT ALL PRIVILEGES ON DATABASE web_example    TO web_example;
GRANT ALL PRIVILEGES ON DATABASE keycloak       TO keycloak;
GRANT ALL PRIVILEGES ON DATABASE openfga        TO openfga;

-- Grant schema-level privileges for each database
-- We need to connect to each database to grant schema privileges
\c keycloak;
GRANT ALL PRIVILEGES ON SCHEMA public TO keycloak;
\c web_example;
GRANT ALL PRIVILEGES ON SCHEMA public TO web_example;
\c auth_example;
GRANT ALL PRIVILEGES ON SCHEMA public TO auth_example;
\c server_example;
GRANT ALL PRIVILEGES ON SCHEMA public TO server_example;
\c openfga;
GRANT ALL PRIVILEGES ON SCHEMA public TO openfga;