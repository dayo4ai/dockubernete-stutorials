# FROM python:3.9
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install -r requirements.txt
# COPY . .
# CMD ["python", "app.py"]

FROM python:3.9

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy project
COPY . .

# Expose port
EXPOSE 8000

# Run gunicorn
CMD gunicorn --bind "0.0.0.0:$PORT" --workers 4 app:app