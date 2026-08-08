@echo off
REM Check venv folder
echo "======== CHECKING VENV FOLDER ======="
IF NOT EXIST ".venv" (
    echo "Creating .venv folder"
    call python -m venv .venv
)

REM Activate VENV
echo "======== ACTIVATE VENV ======="
call .venv\Scripts\activate.bat

REM Pip list
echo "======== CHECKING DEPENDENCIES ======="
call python -m pip list

REM refresh requirements
echo "======== DUMP REQUIREMENTS TO FILE ======="
call python -m pip freeze -l > requirements.txt

echo "======== START DEV SERVER ======="
call python manage.py runserver