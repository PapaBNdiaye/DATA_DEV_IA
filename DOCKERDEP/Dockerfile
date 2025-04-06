# 1)  Préciser avec le FROM, notre image de référence
FROM python:3.11-slim
# 2) Préciser notre repertoire du projet
WORKDIR /app
# 3) Indiquer le requirements.txt qui contient les packages necessaires pour notre application.
    # ainsi, on va copier le fichier dans notre container Docker avec la commande COPY 
COPY /app/requirements.txt requirements.txt
# 4) Lancer une commande d'installation des packages existants dans requirements.txt 
RUN pip install -r requirements.txt
# 5) Ensuite, copier tout ce qui reste avec la commande 
COPY . .
# 6) Ensuite faire une expose de notre port  1111
EXPOSE 1111
# 7) Et enfin lancer notre commande qui permet d'executer notre application
CMD [ "python", "app/main_flask.py" ]
