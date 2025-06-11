FROM tensorflow/tensorflow:2.14.0

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY inference/main.py inference/
COPY inference/schemas.py inference/

COPY inference/smurf-regressor/ inference/smurf-regressor/

EXPOSE 8000

CMD ["uvicorn", "inference.main:app", "--host", "0.0.0.0", "--port", "8000"]
