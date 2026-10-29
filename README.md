# Secure CI/CD Pipeline Using DevSecOps

## Project Overview

This project aims to integrate security checks into a Continuous Integration and Continuous Delivery (CI/CD) pipeline using the DevSecOps approach.

The goal is to automate basic validation and security scanning so that potential security issues can be identified early in the software development process.

## Objectives

- Automate workflow execution using GitHub Actions.
- Perform basic repository validation.
- Detect accidentally exposed secrets using Gitleaks.
- Integrate dependency vulnerability scanning.
- Implement policy-based security gates.
- Develop a dashboard to display security scan results.

## Proposed Workflow

1. Code is pushed to the GitHub repository.
2. GitHub Actions automatically triggers the workflow.
3. Basic repository checks are executed.
4. Gitleaks scans the repository for exposed secrets.
5. Future stages will include dependency scanning and severity-based security checks.
6. A vulnerability dashboard will display aggregated results in a future implementation phase.

## Technologies

| Technology | Purpose |
|---|---|
| Git and GitHub | Source code management |
| GitHub Actions | Workflow automation |
| Gitleaks | Secret scanning |
| Dependency scanning tools | Planned vulnerability detection |
| React and Chart.js | Planned security dashboard |

## Current Implementation Status

The initial prototype includes:

- A GitHub Actions workflow triggered by code pushes.
- An automated README validation check.
- Gitleaks integration for secret scanning.
- Successful workflow execution verified through GitHub Actions.

The current workflow has successfully completed its repository validation and secret-scanning steps.

**Note:** The README validation checks whether `README.md` exists and is non-empty. It does not test the functionality of an application.

## Planned Enhancements

- Integrate a sample College Management System application.
- Add dependency vulnerability scanning.
- Implement severity-based security gating.
- Develop a vulnerability dashboard.
- Evaluate detection results and pipeline execution time.

## Project Scope

This is an academic prototype developed to demonstrate the initial stages of a DevSecOps pipeline. The complete security scanning, deployment gating, and dashboard features are planned for subsequent implementation.

## Team

- Anshika Singh
- Ishika Yadav
- Pavni Gupta

**Project:** Secure CI/CD Pipeline Using DevSecOps  
**Department:** Information Technology  
**Institution:** Bharati Vidyapeeth's College of Engineering, Delhi
