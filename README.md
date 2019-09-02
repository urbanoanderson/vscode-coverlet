[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/urbanoanderson.vscode-coverlet.svg)](https://marketplace.visualstudio.com/items?itemName=urbanoanderson.vscode-coverlet) [![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/urbanoanderson.vscode-coverlet.svg)](https://marketplace.visualstudio.com/items?itemName=urbanoanderson.vscode-coverlet) [![Build Status](https://travis-ci.org/urbanoanderson/vscode-coverlet.svg?branch=master)](https://travis-ci.org/urbanoanderson/vscode-coverlet)

# Vscode-Coverlet

## About

Edits coverlet report files to strip all the already tested code so you can focus on what needs to be tested.

Icon made by Freepik and available at `www.flaticon.com/free-icon/test_115050`

## Preview

![Image](./img/preview.gif)

## To Run

- Open command menu on vscode with: `CTRL` + `SHIFT` + `P`

- Run `Coverlet Strip` on an opened `coverlet.json` report file

## Debugging the extension source

- Clone the source at `https://github.com/urbanoanderson/vscode-coverlet.git`

- Open extension folder on vscode

- Run `npm install` on terminal

- Click on `Start Debugging` in the Debug panel

- A test instance of vscode loaded with the extension will appear

## Release Notes

### 1.0.1

- Fix bug that leaves null values while removing some branches

### 1.0.0

- Initial Version