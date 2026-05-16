FROM python:3.14.0-slim

COPY requirements.txt requirements.txt
RUN pip install --upgrade pip wheel
RUN pip install -r requirements.txt

COPY . . 

CMD ["python", "main.py"]