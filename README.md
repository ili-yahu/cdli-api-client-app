---
aliases: CDLI API Client application
license: MIT
date: 2024-10-17
version: Pre-release 1.2.3
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
If you plan to use the packaged version of the program, you will have to head to this [link](https://nextcloud.univ-lille.fr/index.php/s/KZKJmy2sn5yspJn) on my uni NextCloud to download the .exe file. Unfortunately, since electron apps are infamously known to be quite bloated, the .exe file is too big to be directly added to my repository. You should normally be able to install the .exe from the Nextcloud link and run the application without having to install anything first. In the foreseeable future, I will try to reduce the size of the .exe file in order to add it to the repository, or at least find a more definite way to make the .exe file available. If I ever feel brave enough, I may try to get rid of electron altogether, but I'm not talented enough to make that a promise.
At the time of writing (2024-10-17), I'm still a 2nd year PhD student so the link should be safe for at least a year or two. 

For MacOS and Linux users, or for the people who don't want to use a packaged application, as mentioned above, you will have to install Node.js and the listed dependencies and launch the code from there. The GUI will still work fine, and you should even be able to package the application on your own by typing `npm run make` in the command prompt. Please, do not hesitate to send me the installer after that, so that I can add it to my Nextcloud folder.

# Credits
Original developer of the CDLI Framework API Client: [Lars Willighagen](https://orcid.org/0000-0002-4751-4637). Visit the CDLI [GitHub repository](https://github.com/cdli-gh/framework-api-client).
