## Installing and Running:

Install Node Dependencies

    npm install


Setup Python Env and Create Platform Executable

    cd pyapi
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    pip install pyinstaller
    pyinstaller program.py
    cd ..

Running the Application:

    npm start


## Building Distributables

    npm electron-builder -mwl

In the newly create dist folder. Extract the files needed and test/run on the targetted machine/platform


## Prerequisites

- Python3 installed
- npm or yarn installed
- node installed

## Directory Structure

All python code which contains parsing, processing and managing all CSV, PDF and business logic will be located inside pyapi directory.

All UI logic and user interaction will be managed in the root directory javascript files

## Other Notes
This description is simply for how to get the app started and running for developers. To refer to exports, labeling rules and PDF fields refer to professor for information.
