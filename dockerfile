# Gebruik een TensorFlow image als basis (incl. GPU als je nodig hebt)
FROM tensorflow/tensorflow:2.14.0  
# Of "tensorflow/tensorflow:2.14.0-gpu" voor GPU

# Zet een werkdirectory
WORKDIR /app

# Kopieer requirements
COPY requirements.txt .

# Installeer Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Kopieer je app code naar de container
COPY . .

# Expose poort waarop Uvicorn draait
EXPOSE 8000

# Start de API met Uvicorn
CMD ["uvicorn", "inference.main:app", "--host", "0.0.0.0", "--port", "8000"]
