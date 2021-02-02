# Device Simulator Web Application

[![GitHub Actions](https://github.com/NordicSemiconductor/asset-tracker-cloud-device-ui-js/workflows/Test%20and%20Release/badge.svg)](https://github.com/NordicSemiconductor/asset-tracker-cloud-device-ui-js/actions)
[![Known Vulnerabilities](https://snyk.io/test/github/NordicSemiconductor/asset-tracker-cloud-device-ui-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/NordicSemiconductor/asset-tracker-cloud-device-ui-js?targetFile=package.json)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/NordicSemiconductor/asset-tracker-cloud-device-ui-js)](https://mergify.io)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

Provides a user interface via a web application to interact with a software Cat
Tracker running in Node.js.

The software Cat Trackers are provided by the respective cloud flavours of the
Asset Tracker Cloud Example:

- [AWS](https://github.com/NordicSemiconductor/asset-tracker-cloud-aws-js)
- [Azure](https://github.com/NordicSemiconductor/asset-tracker-cloud-azure-js)

> :information_source:
> [Read the complete Asset Tracker Cloud Example documentation](https://nordicsemiconductor.github.io/asset-tracker-cloud-docs/).

## Set up

    npm ci

## Running

    npm start

After executing the above command, copy the connection string printed from
`node cli connect "<id of your device>"` (e.g.
`?endpoint=http%3A%2F%2Flocalhost%3A23719`) and append it to the browser
address. (for example,
`http://localhost:8080/?endpoint=http%3A%2F%2Flocalhost%3A23719`).
