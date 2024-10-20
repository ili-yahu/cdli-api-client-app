---
aliases: CDLI API Client application
license: MIT
date: 2024-10-20
version: Pre-release 1.2.4
author: Ilī-Yahu
contact: ili-yahu@pm.me
---

# Presentation
A simple (planned) multi-OS application that aims to streamline the user experience for the CDLI API by providing a GUI and suggestions for input commands.

# Install
## Warning
This application has only been tested on a Windows 11 computer. I still need to try to package the app for Linux and MacOS. For now, you will have to package it yourself by installing Node.js and the dependencies mentioned in the package.json file (mostly by typing `npm install XXXX` in the Node.js command prompt) until I'm able to do it on a Mac.

A great share of the code has been written with the help of the LLM ChatGPT-4 mini. This means that the code still needs a whole lot of cleaning up to improve it and I have yet to do it. In the meantime, feel free to submit improvements, fork the repository, etc...

## Prerequisites
### Windows
If you plan to use the pre-packaged version of the program, you will have to head to this [link](https://nextcloud.univ-lille.fr/index.php/s/KZKJmy2sn5yspJn) on my uni NextCloud to download the .exe file. Unfortunately, since electron apps are infamously known to be quite bloated, the .exe file is too big to be directly added to my repository. You should be able to install the program without any problem with the .exe from the Nextcloud link. However, for the moment, in order to run commands, you will have first to install [Node.js](https://nodejs.org/en) and the [cdli-api-client](https://github.com/cdli-gh/framework-api-client) package. Once Node.js has been installed, just type `npm install -g cdli-api-client` in the Node.js command prompt to install the cdli package, and you should be good to go. Once that's done, you should be able to launch the application and input commands without a problem.

In the foreseeable future, I'd like to make the program fully autonomous, so that you don't have to install Node.js and the cdli-api-client package manually. I would also like to try to reduce the size of the .exe file in order to add it to the repository, or at least find a more definite way to make the .exe file available. If I ever feel brave enough, I may try to get rid of electron altogether, but I'm not talented enough to make that a promise.
At the time of writing (2024-10-20), I'm still a 2nd year PhD student so the link should be safe for at least a year or two. 

### MacOS and Linux
For MacOS and Linux users, or for the people who don't want to use a packaged application, as mentioned above, you will have to install Node.js and the dependencies listed in the package.json file and launch the code through the Node.js command prompt. The GUI will still work fine, and you should even be able to package the application on your own by typing `npm run make` in the command prompt. Please, do not hesitate to send me the installer after that, so that I can add it to my Nextcloud folder.

# How to use?
You can find the list of commands in the readme file of the [CDLI Framework API Client repository](https://github.com/cdli-gh/framework-api-client?tab=readme-ov-file#getting-started). You don't have to type `cdli` at the beginning, as it is automatically added to every command. Here are some sample commands to get started:
- `search --fk period --fv "Old Assyrian (ca. 1950-1850 BC)"  -f csv -o OA_texts.cv` will fetch every single artefact from the Old Assyrian period and output a .csv file named OA_texts.csv out of this query. By default, it will appear on your desktop.
- `search -q dam-gar3 --fv "Old Babylonian (ca. 1900-1600 BC)" -f ndjson -o OB_texts_with_dam-gar3.json` will fetch every single artefact from the Old Babylonian period that contains the sequence dam-gar3, and output a .json file named OB_texts_with_dam-gar3.json out of this query. By default, it will appear on your desktop.

# Credits
Original developer of the CDLI Framework API Client: [Lars Willighagen](https://orcid.org/0000-0002-4751-4637). Visit the CDLI [GitHub repository](https://github.com/cdli-gh/framework-api-client).
