# Device Simulator UI

[![GitHub Actions](https://github.com/NordicSemiconductor/asset-tracker-cloud-device-ui-js/workflows/Test%20and%20Release/badge.svg)](https://github.com/NordicSemiconductor/asset-tracker-cloud-device-ui-js/actions)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/NordicSemiconductor/asset-tracker-cloud-device-ui-js)](https://mergify.io)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

Provides a user interface via a web application to interact with a simulated
device for the nRF Asset Tracker.

The simulated devices are provided for each cloud flavours of the nRF Asset
Tracker:

- [AWS](https://github.com/NordicSemiconductor/asset-tracker-cloud-aws-js)
- [Azure](https://github.com/NordicSemiconductor/asset-tracker-cloud-azure-js)

> :information_source:
> [Read the complete nRF Asset Tracker documentation](https://nordicsemiconductor.github.io/asset-tracker-cloud-docs/).

## Set up

    npm ci

## Running

    npm start

After executing the above command, copy the connection string printed from
`npm exec -- @nordicsemiconductor/asset-tracker-cloud-device-simulator-aws "</path/to/certificate.json>"`
(e.g. `http://localhost:24272`) and provide it in the endpoint input field.
