FROM ubuntu:16.04

RUN locale-gen en_US.UTF-8
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8' TERM=xterm
RUN update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8

RUN apt-get update -y && \
apt-get install --no-install-recommends -y build-essential nodejs git python python3 python3-dev \
    virtualenv libpq-dev libreadline-dev libncurses5-dev postgresql-client postgresql-9.5 vim nginx m4 supervisor htop nano screen ssh rsync psmisc
RUN apt-get install --no-install-recommends -y aptitude postgresql-9.5-postgis-2.2

WORKDIR /app/
RUN virtualenv -p python3 venv
COPY requirements.txt .
RUN ./venv/bin/pip install -r requirements.txt

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/sites-available/default
COPY supervisor-app.conf /etc/supervisor/conf.d/

RUN echo "local all all trust" > /etc/postgresql/9.5/main/pg_hba.conf
RUN echo "host all all 127.0.0.1/32 trust" >> /etc/postgresql/9.5/main/pg_hba.conf

WORKDIR /app/
COPY . /app
RUN ./venv/bin/python manage.py collectstatic --noinput


COPY .screenrc /root/

EXPOSE 80
CMD ["supervisord", "-n"]
